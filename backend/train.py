



import cv2 as cv
import os
import numpy as np
import matplotlib.pyplot as plt
from keras_facenet import FaceNet
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import pickle

class FACELOADING:
    def __init__(self, directory):
        self.directory = directory
        self.target_size = (160, 160)

        # Load the DNN face detector
        prototxtPath = "/home/etherealumer/Desktop/tf/FYPSmartGuard/Backend/deploy.prototxt"
        caffeModelPath = "/home/etherealumer/Desktop/tf/FYPSmartGuard/Backend/res10_300x300_ssd_iter_140000_fp16.caffemodel"

        if not os.path.isfile(prototxtPath) or not os.path.isfile(caffeModelPath):
            raise FileNotFoundError("DNN model files not found. "
                                    "Please make sure 'deploy.prototxt.txt' and 'res10_300x300_ssd_iter_140000.caffemodel' "
                                    "are available in the current directory.")
        self.face_net = cv.dnn.readNetFromCaffe(prototxtPath, caffeModelPath)

        self.X = []
        self.Y = []

    def detect_faces_dnn(self, img, conf_threshold=0.5):
        # Prepare image for DNN
        (h, w) = img.shape[:2]
        blob = cv.dnn.blobFromImage(cv.resize(img, (300, 300)), 1.0, (300, 300),
                                    (104.0, 177.0, 123.0))
        self.face_net.setInput(blob)
        detections = self.face_net.forward()

        boxes = []
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > conf_threshold:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                startX = max(0, startX)
                startY = max(0, startY)
                endX = min(w, endX)
                endY = min(h, endY)
                # width and height
                face_w = endX - startX
                face_h = endY - startY
                boxes.append((startX, startY, face_w, face_h))
        return boxes

    def extract_face(self, filename):
        try:
            img = cv.imread(filename)
            if img is None:
                print(f"[WARNING] Unable to load image: {filename}")
                return None
            img_rgb = cv.cvtColor(img, cv.COLOR_BGR2RGB)
            results = self.detect_faces_dnn(img_rgb)
            if results:
                x, y, w, h = results[0]
                face = img_rgb[y:y+h, x:x+w]
                # Resize to the target size
                face_arr = cv.resize(face, self.target_size)
                return face_arr
        except Exception as e:
            print(f"Error in extracting face from {filename}: {e}")
        return None

    def load_faces(self, dir):
        FACES = []
        for im_name in os.listdir(dir):
            try:
                path = os.path.join(dir, im_name)
                single_face = self.extract_face(path)
                if single_face is not None:
                    FACES.append(single_face)
            except Exception as e:
                print(f"Failed to load face from {im_name}: {e}")
        return FACES

    def load_classes(self):
        for sub_dir in os.listdir(self.directory):
            class_dir = os.path.join(self.directory, sub_dir)
            if not os.path.isdir(class_dir):
                continue
            FACES = self.load_faces(class_dir)
            labels = [sub_dir for _ in range(len(FACES))]
            self.X.extend(FACES)
            self.Y.extend(labels)
            print(f"Loaded successfully: {len(FACES)} faces for class '{sub_dir}'")
        return np.asarray(self.X), np.asarray(self.Y)

# Example usage
faceloading = FACELOADING("dataset_and_files/dataset")
try:
    X, Y = faceloading.load_classes()
except Exception as e:
    print(f"Error loading classes: {e}")

embedder = FaceNet()

def get_embedding(face_img):
    try:
        face_img = face_img.astype('float32')  # 3D(160x160x3)
        face_img = np.expand_dims(face_img, axis=0)  # Make 4D batch
        yhat = embedder.embeddings(face_img)
        return yhat[0]  # 512D
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return None

EMBEDDED_X = []
for img in X:
    embedding = get_embedding(img)
    if embedding is not None:
        EMBEDDED_X.append(embedding)

EMBEDDED_X = np.asarray(EMBEDDED_X)

# Save embeddings
try:
    np.savez_compressed('faces_embeddings_done_4classes.npz', EMBEDDED_X, Y)
except Exception as e:
    print(f"Error saving embeddings: {e}")

# Encoding labels
encoder = LabelEncoder()
encoder.fit(Y)
Y = encoder.transform(Y)

# Split data
try:
    X_train, X_test, Y_train, Y_test = train_test_split(EMBEDDED_X, Y, shuffle=True, random_state=17)
except Exception as e:
    print(f"Error during train-test split: {e}")

# Train SVM model
try:
    model = SVC(kernel='linear', probability=True)
    model.fit(X_train, Y_train)
except Exception as e:
    print(f"Error training SVM model: {e}")

# Predictions and accuracy check
try:
    ypreds_train = model.predict(X_train)
    ypreds_test = model.predict(X_test)
    print(f"Train accuracy: {accuracy_score(Y_train, ypreds_train)}")
    print(f"Test accuracy: {accuracy_score(Y_test, ypreds_test)}")
except Exception as e:
    print(f"Error during prediction or accuracy calculation: {e}")

# Save the model
try:
    with open('svm_model_160x160.pkl', 'wb') as f:
        pickle.dump(model, f)
except Exception as e:
    print(f"Error saving the model: {e}")
