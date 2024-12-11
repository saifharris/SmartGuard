import cv2 as cv
import numpy as np
from keras_facenet import FaceNet
from sklearn.preprocessing import LabelEncoder
import pickle
from pymongo import MongoClient
import certifi

# MongoDB Connection
client = MongoClient("mongodb+srv://i211176:36775@cluster0.vjz8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["SmartGuard"]
collection = db["knownOffenders"]

# Thresholds and Model Loading
CONFIDENCE_THRESHOLD = 0.70
RECOGNITION_THRESHOLD = 0.80

def initialize_models():
    """Initializes and returns the required models and encoders."""
    facenet = FaceNet()
    faces_embeddings = np.load("/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/faces_embeddings_done_4classes.npz")
    Y = faces_embeddings['arr_1']
    encoder = LabelEncoder()
    encoder.fit(Y)
    model = pickle.load(open("/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/svm_model_160x160.pkl", 'rb'))
    modelFile = "/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/res10_300x300_ssd_iter_140000_fp16.caffemodel"
    configFile = "/home/etherealumer/Desktop/tf/mc-mot/againNEw/SmartGuard/backend/deploy.prototxt"
    net = cv.dnn.readNetFromCaffe(configFile, modelFile)
    return facenet, encoder, model, net

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
        if confidence > CONFIDENCE_THRESHOLD:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            face_box = (startX, startY, endX - startX, endY - startY)
            face_boxes.append(face_box)
    return face_boxes

def recognize_face(facenet, encoder, model, face_img):
    """Recognize the face in the provided image and return probabilities."""
    face_img_rgb = cv.cvtColor(face_img, cv.COLOR_BGR2RGB)
    face_img_resized = cv.resize(face_img_rgb, (160, 160))
    face_img_expanded = np.expand_dims(face_img_resized, axis=0)
    embedding = facenet.embeddings(face_img_expanded)
    probabilities = model.predict_proba(embedding)[0]
    return probabilities

def query_offender_database(name):
    """Search for the recognized offender in MongoDB and return their details."""
    offender_data = collection.find_one({"name": name})
    if offender_data:
        return offender_data
    else:
        return None

def recognize_from_image(image_path):
    """Recognize faces from the uploaded image and check for known offenders."""
    facenet, encoder, model, net = initialize_models()

    # Read the uploaded image
    image = cv.imread(image_path)
    if image is None:
        print("Error: Unable to read the image.")
        return None

    face_boxes = detect_faces(net, image)

    if len(face_boxes) > 0:
        for face_box in face_boxes:
            x, y, w_f, h_f = face_box
            face_img = image[y:y + h_f, x:x + w_f]

            if face_img.size != 0:
                probabilities = recognize_face(facenet, encoder, model, face_img)
                max_prob = np.max(probabilities)

                if max_prob >= RECOGNITION_THRESHOLD:
                    # Get the name of the recognized offender
                    name = encoder.classes_[np.argmax(probabilities)]
                    print(f"Recognized Known Offender: {name}")

                    # Query MongoDB for the offender details
                    offender_data = query_offender_database(name)
                    if offender_data:
                        print(f"Offender Details: Name: {offender_data['name']}, Date: {offender_data['date']}")

                        # Prepare response
                        response = {
                            "name": offender_data.get('name'),
                            "date": offender_data.get('date'),
                            "images": {
                                "left": offender_data.get('images', {}).get('left'),
                                "right": offender_data.get('images', {}).get('right'),
                                "frontal": offender_data.get('images', {}).get('frontal')
                            }
                        }
                        return response
                    else:
                        # Offender is not found in the database for some reason
                        return None
                else:
                    print("Unknown face detected.")
                    return None
    else:
        print("No face detected.")
        return None

