# IMPORTS
import cv2 as cv
import numpy as np
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
import pickle
from keras_facenet import FaceNet
import threading
from collections import deque  # Import deque for fixed-size probability buffer

# GLOBAL VARIABLES AND SETTINGS
CONFIDENCE_THRESHOLD = 0.70  # Confidence threshold for face detection
RECOGNITION_THRESHOLD = 0.80  # Probability threshold for face recognition
DETECT_INTERVAL = 15        # Number of frames between detections
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
PROBABILITIES_BUFFER_SIZE = 5  # Number of frames to average over
MIN_PROBABILITIES_FOR_DECISION = 3  # Minimum frames required to make a decision

# GPU CONFIGURATION (Optional if you have a GPU)
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        # Set memory growth to avoid consuming all GPU memory
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print("GPU is available and will be used for acceleration.")
    except RuntimeError as e:
        print(e)
else:
    print("No GPU found. The program will run on CPU, which may be slower.")

def initialize_models():
    """Initializes and returns the required models and encoders."""
    # Initialize FaceNet model
    facenet = FaceNet()
    # Load face embeddings and labels
    faces_embeddings = np.load("/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/faces_embeddings_done_4classes.npz")
    Y = faces_embeddings['arr_1']
    encoder = LabelEncoder()
    encoder.fit(Y)
    # Load the trained SVM model
    model = pickle.load(open("/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/svm_model_160x160.pkl", 'rb'))
    # Load OpenCV's DNN face detector
    modelFile = "/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/res10_300x300_ssd_iter_140000_fp16.caffemodel"
    configFile = "/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/deploy.prototxt"
    net = cv.dnn.readNetFromCaffe(configFile, modelFile)
    return facenet, encoder, model, net

class VideoStreamWidget:
    def __init__(self, src=0):
        self.capture = cv.VideoCapture(src)
        self.capture.set(cv.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
        self.capture.set(cv.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
        self.status, self.frame = self.capture.read()
        self.lock = threading.Lock()
        self.stopped = threading.Event()
        threading.Thread(target=self.update, args=()).start()

    def update(self):
        while not self.stopped.is_set():
            if self.capture.isOpened():
                status, frame = self.capture.read()
                with self.lock:
                    self.status = status
                    self.frame = frame
            else:
                break

    def get_frame(self):
        with self.lock:
            return self.status, self.frame

    def release(self):
        self.stopped.set()
        self.capture.release()

def detect_faces(net, frame):
    """Detect faces in the frame using the provided DNN model."""
    h, w = frame.shape[:2]
    blob = cv.dnn.blobFromImage(cv.resize(frame, (300, 300)),
                                1.0, (300, 300), [104, 117, 123], False, False)
    net.setInput(blob)
    detections = net.forward()
    face_boxes = []

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        print(F"confidence:{confidence}")
        if confidence > CONFIDENCE_THRESHOLD:
            # Get the bounding box coordinates
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            # Adjust coordinates to be within the image boundaries
            startX = max(0, min(startX, w - 1))
            startY = max(0, min(startY, h - 1))
            endX = max(0, min(endX, w - 1))
            endY = max(0, min(endY, h - 1))

            face_box = (startX, startY, endX - startX, endY - startY)
            face_boxes.append(face_box)
    return face_boxes

def recognize_face(facenet, encoder, model, face_img):
    """Recognize the face in the provided image and return probabilities."""
    face_img_rgb = cv.cvtColor(face_img, cv.COLOR_BGR2RGB)
    face_img_resized = cv.resize(face_img_rgb, (160, 160))
    face_img_expanded = np.expand_dims(face_img_resized, axis=0)
    embedding = facenet.embeddings(face_img_expanded)

    # Get probability estimates
    probabilities = model.predict_proba(embedding)[0]  # Get probabilities for the single sample
    return probabilities

def main():
    # Initialize models
    facenet, encoder, model, net = initialize_models()
    # Initialize video stream
    video_stream_widget = VideoStreamWidget()
    # Initialize variables for face tracking
    faces_info = []  # List to hold face information (tracker, identity)
    frame_count = 0

    while True:
        status, frame = video_stream_widget.get_frame()
        if not status or frame is None:
            print("Failed to capture frame")
            continue

        frame_resized = cv.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
        h, w = frame_resized.shape[:2]

        if frame_count % DETECT_INTERVAL == 0:
            # Perform face detection
            face_boxes = detect_faces(net, frame_resized)
            # Reset trackers and face info
            faces_info = []

            for face_box in face_boxes:
                # Initialize the tracker with the detected face
                tracker = cv.TrackerMIL_create()
                initBB = face_box
                tracker.init(frame_resized, initBB)

                x, y, w_f, h_f = face_box

                # Adjust coordinates to be within the image boundaries
                x = max(0, int(x))
                y = max(0, int(y))
                x2 = min(x + int(w_f), frame_resized.shape[1])
                y2 = min(y + int(h_f), frame_resized.shape[0])

                # Ensure that the width and height are positive after adjustment
                if x2 - x > 0 and y2 - y > 0:
                    face_img = frame_resized[y:y2, x:x2]
                    # Check if face_img is not empty
                    if face_img.size != 0:
                        probabilities = recognize_face(facenet, encoder, model, face_img)
                        # Initialize probabilities buffer
                        prob_buffer = deque(maxlen=PROBABILITIES_BUFFER_SIZE)
                        prob_buffer.append(probabilities)
                        # Initialize face_info
                        face_info = {
                            'tracker': tracker,
                            'probabilities': prob_buffer,
                            'name': None
                        }
                        faces_info.append(face_info)
                    else:
                        print("Warning: face_img is empty after cropping.")
                else:
                    print("Warning: Invalid face bounding box dimensions.")
        else:
            # Update all trackers and draw bounding boxes
            new_faces_info = []
            for face_info in faces_info:
                tracker = face_info['tracker']
                success, box = tracker.update(frame_resized)
                if success:
                    x, y, w_f, h_f = [int(v) for v in box]
                    # Adjust coordinates to be within the image boundaries
                    x = max(0, x)
                    y = max(0, y)
                    x2 = min(x + w_f, frame_resized.shape[1])
                    y2 = min(y + h_f, frame_resized.shape[0])

                    if x2 - x > 0 and y2 - y > 0:
                        # Extract face image
                        face_img = frame_resized[y:y2, x:x2]
                        if face_img.size != 0:
                            probabilities = recognize_face(facenet, encoder, model, face_img)
                            face_info['probabilities'].append(probabilities)

                            # Compute average probabilities
                            avg_probabilities = np.mean(face_info['probabilities'], axis=0)
                            max_prob = np.max(avg_probabilities)
                            print(f"Average probabilities: {avg_probabilities}")
                            print(f"Max average probability: {max_prob}")

                            if len(face_info['probabilities']) >= MIN_PROBABILITIES_FOR_DECISION:
                                if max_prob < RECOGNITION_THRESHOLD:
                                    final_name = "Unknown"
                                else:
                                    # Get the index of the max probability
                                    max_index = np.argmax(avg_probabilities)
                                    # Get the corresponding class label
                                    final_name = encoder.classes_[max_index]
                                face_info['name'] = final_name

                            # Draw the bounding box
                            cv.rectangle(frame_resized, (x, y), (x2, y2), (255, 0, 255), 2)
                            if face_info['name']:
                                cv.putText(frame_resized, str(face_info['name']), (x, y - 10),
                                           cv.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2, cv.LINE_AA)
                            else:
                                cv.putText(frame_resized, "Recognizing...", (x, y - 10),
                                           cv.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2, cv.LINE_AA)
                            # Keep the face info
                            new_faces_info.append(face_info)
                        else:
                            print("Warning: face_img is empty after cropping.")
                    else:
                        print("Warning: Tracker provided invalid bounding box dimensions.")
                else:
                    # Tracking failure, do not keep this tracker
                    print("Tracking failure detected.")
            # Update the faces_info list
            faces_info = new_faces_info

        frame_count += 1

        # Display the resulting frame
        cv.imshow("Face Recognition", frame_resized)
        if cv.waitKey(1) & 0xFF == ord('q'):
            break

    # Release resources
    video_stream_widget.release()
    cv.destroyAllWindows()

if __name__ == "__main__":
    main()