


import cv2
import numpy as np
from PIL import Image, ImageEnhance
import random
import os
import argparse

# Command-line argument parsing
parser = argparse.ArgumentParser()
parser.add_argument('--person_name', required=True, help='Name of the person')
parser.add_argument('--images', nargs='+', required=True, help='Paths to the image files')
parser.add_argument('--output_dir', required=True, help='Directory to save augmented images')

args = parser.parse_args()
person_name = args.person_name
image_paths = args.images
output_folder = args.output_dir

# Validate input arguments
if not image_paths:
    raise ValueError("No image paths provided. Please provide at least one image path.")

# Create the output directory if it doesn't exist
if not os.path.exists(output_folder):
    try:
        os.makedirs(output_folder)
        print(f"[INFO] Created folder: {output_folder}")
    except OSError as e:
        raise OSError(f"Failed to create output directory {output_folder}: {e}")

# Check if image files exist
for path in image_paths:
    if not os.path.isfile(path):
        print(f"[WARNING] File does not exist: {path}")

# Load images
images = []
for path in image_paths:
    if os.path.isfile(path):
        img = cv2.imread(path)
        if img is None:
            print(f"[WARNING] Failed to load image at: {path}")
        else:
            images.append((path, img))
    else:
        print(f"[WARNING] Skipping non-existent file: {path}")

if not images:
    raise ValueError("No valid images were loaded. Exiting.")

# Load the DNN face detector (Caffe model)
# Ensure these paths point to your downloaded model files
prototxtPath = "/home/etherealumer/Desktop/tf/FYPSmartGuard/Backend/deploy.prototxt"
caffeModelPath = "/home/etherealumer/Desktop/tf/FYPSmartGuard/Backend/res10_300x300_ssd_iter_140000_fp16.caffemodel"

if not os.path.isfile(prototxtPath) or not os.path.isfile(caffeModelPath):
    raise FileNotFoundError("DNN model files not found. Please provide deploy.prototxt.txt and res10_300x300_ssd_iter_140000.caffemodel")

face_net = cv2.dnn.readNetFromCaffe(prototxtPath, caffeModelPath)

def detect_faces_dnn(img, conf_threshold=0.5):
    """Use OpenCV DNN to detect faces in an image. Returns a list of bounding boxes (x, y, w, h)."""
    (h, w) = img.shape[:2]
    # Create a blob and perform a forward pass
    blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0, 
                                 (300, 300), (104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()

    boxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            # Ensure bounding boxes fall within the image dimensions
            startX = max(0, startX)
            startY = max(0, startY)
            endX = min(w, endX)
            endY = min(h, endY)
            boxes.append((startX, startY, endX - startX, endY - startY))
    return boxes

def has_face(img):
    """Check if the image contains at least one face using DNN face detector."""
    faces = detect_faces_dnn(img)
    return len(faces) > 0

# Filter images to only those that contain a face
valid_images = []
for path, img in images:
    if has_face(img):
        valid_images.append(img)
    else:
        print(f"[WARNING] No face detected in {path}. Skipping this image.")

if not valid_images:
    print("[INFO] No images contained a face. No augmentation performed.")
    exit(0)

def save_augmented_image(img, seq_index):
    if img is None:
        print(f"[WARNING] Image at index {seq_index} is None, skipping save.")
        return
    output_path = os.path.join(output_folder, f"{seq_index}.jpg")
    try:
        cv2.imwrite(output_path, img)
        print(f"[INFO] Saved {output_path}")
    except Exception as e:
        print(f"[ERROR] Failed to save {output_path}: {e}")

# Augmentation functions
def random_rotation(img):
    if img is None:
        return None
    angle = random.randint(-30, 30)
    h, w = img.shape[:2]
    center = (w // 2, h // 2)
    rot_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img, rot_matrix, (w, h))
    return rotated

def random_translation(img):
    if img is None:
        return None
    tx = random.randint(-20, 20)
    ty = random.randint(-20, 20)
    translation_matrix = np.float32([[1, 0, tx], [0, 1, ty]])
    translated = cv2.warpAffine(img, translation_matrix, (img.shape[1], img.shape[0]))
    return translated

def gaussian_blur(img):
    if img is None:
        return None
    ksize = random.choice([3, 5, 7])
    blurred = cv2.GaussianBlur(img, (ksize, ksize), 0)
    return blurred

def adjust_brightness(img):
    if img is None:
        return None
    factor = random.uniform(0.5, 1.5)
    pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    enhancer = ImageEnhance.Brightness(pil_img)
    brightened = enhancer.enhance(factor)
    return cv2.cvtColor(np.array(brightened), cv2.COLOR_RGB2BGR)

def add_noise(img):
    if img is None:
        return None
    noise = np.random.randint(0, 50, img.shape, dtype='uint8')
    noised = cv2.add(img, noise)
    return noised

def horizontal_flip(img):
    if img is None:
        return None
    flipped = cv2.flip(img, 1)
    return flipped

def adjust_contrast(img):
    if img is None:
        return None
    factor = random.uniform(0.5, 1.5)
    pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    enhancer = ImageEnhance.Contrast(pil_img)
    contrasted = enhancer.enhance(factor)
    return cv2.cvtColor(np.array(contrasted), cv2.COLOR_RGB2BGR)

def zoom_in_on_face(img):
    if img is None:
        return None
    faces = detect_faces_dnn(img)
    if len(faces) > 0:
        x, y, w, h = faces[0]
        margin = int(0.5 * max(w, h))
        x1, y1 = max(0, x - margin), max(0, y - margin)
        x2, y2 = min(img.shape[1], x + w + margin), min(img.shape[0], y + h + margin)
        cropped = img[y1:y2, x1:x2]
        # Ensure cropped region is not empty
        if cropped.size > 0:
            resized = cv2.resize(cropped, (img.shape[1], img.shape[0]))
            return resized
    # Return the original if no face is found or cropping failed
    return img

def convert_grayscale(img):
    if img is None:
        return None
    grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    converted = cv2.cvtColor(grayscale, cv2.COLOR_GRAY2BGR)
    return converted

def sharpen_image(img):
    if img is None:
        return None
    kernel = np.array([[0, -1, 0],
                       [-1, 5,-1],
                       [0, -1, 0]])
    sharpened = cv2.filter2D(img, -1, kernel)
    return sharpened

def simulate_night_vision(img):
    if img is None:
        return None
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    alpha = 2.0  # Contrast control
    beta = 0     # Brightness control
    enhanced = cv2.convertScaleAbs(gray, alpha=alpha, beta=beta)
    enhanced = cv2.GaussianBlur(enhanced, (3, 3), 0)
    night_vision = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
    return night_vision

# List of augmentation functions
augmentations = [
    random_rotation, random_translation, gaussian_blur, adjust_brightness, add_noise,
    horizontal_flip, adjust_contrast, zoom_in_on_face, convert_grayscale, sharpen_image,
    simulate_night_vision
]

seq_index = 1

# Save the original images first (only for those with a detected face)
for img in valid_images:
    save_augmented_image(img, seq_index)
    seq_index += 1

# Apply each augmentation to each valid image and save
for img in valid_images:
    for augmentation in augmentations:
        if img is None:
            print("[WARNING] Encountered None image before augmentation. Skipping.")
            continue
        try:
            augmented_image = augmentation(img)
        except Exception as e:
            print(f"[ERROR] Augmentation {augmentation.__name__} failed: {e}")
            continue

        # Check if augmentation returned a valid image
        if augmented_image is not None and augmented_image.size > 0:
            save_augmented_image(augmented_image, seq_index)
        else:
            print(f"[WARNING] {augmentation.__name__} returned an invalid image, skipping save.")
        seq_index += 1

print("[INFO] Augmentation process completed.")
