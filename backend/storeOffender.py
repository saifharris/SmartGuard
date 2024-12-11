import cv2 as cv
import os
import datetime
import numpy as np
from pymongo import MongoClient
import argparse

def format_image_path(file_path):
    """Format the file path to use backslashes and add a leading slash before 'uploads'."""
    formatted_path = file_path.replace(os.sep, '\\')  # Ensure backslashes
    if not formatted_path.startswith("/"):
        formatted_path = "/" + formatted_path
    return formatted_path

def save_offender_to_mongo(collection, name, date, img_left_path, img_right_path, img_frontal_path):
    """Save offender details (name, date, and image file paths) to MongoDB."""
    formatted_left_path = format_image_path(img_left_path)
    formatted_right_path = format_image_path(img_right_path)
    formatted_frontal_path = format_image_path(img_frontal_path)
    
    offender = {
        "name": name,
        "date": date,
        "images": {
            "left": formatted_left_path,
            "right": formatted_right_path,
            "frontal": formatted_frontal_path
        }
    }
    collection.insert_one(offender)
    print(f"[INFO] Offender {name} saved to database with image paths!")

def save_image_locally(image, upload_folder):
    """Save image locally and return the file path."""
    timestamp = str(int(datetime.datetime.now().timestamp() * 1000))  # Millisecond timestamp
    file_extension = ".webp"
    file_path = os.path.join(upload_folder, f"image-{timestamp}{file_extension}")
    
    # Save the image locally
    cv.imwrite(file_path, image)
    
    return file_path

def process_uploaded_images(collection, image_left_path, image_right_path, image_frontal_path, name, upload_folder):
    """Process the uploaded images for the known offender."""
    # Read images
    image_left = cv.imread(image_left_path)
    image_right = cv.imread(image_right_path)
    image_frontal = cv.imread(image_frontal_path)

    if image_left is None:
        raise ValueError(f"[ERROR] Unable to read image from {image_left_path}")
    if image_right is None:
        raise ValueError(f"[ERROR] Unable to read image from {image_right_path}")
    if image_frontal is None:
        raise ValueError(f"[ERROR] Unable to read image from {image_frontal_path}")

    # Ensure the upload folder exists
    os.makedirs(upload_folder, exist_ok=True)

    # Save images locally
    img_left_path = save_image_locally(image_left, upload_folder)
    img_right_path = save_image_locally(image_right, upload_folder)
    img_frontal_path = save_image_locally(image_frontal, upload_folder)

    # Save to MongoDB
    date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    save_offender_to_mongo(collection, name, date, img_left_path, img_right_path, img_frontal_path)

if __name__ == "__main__":

    print("[INFO] Starting the process...")

    # Command-line argument parsing
    parser = argparse.ArgumentParser(description="Save known offender images and details to MongoDB.")
    parser.add_argument('--db_uri', required=True, help='MongoDB connection URI')
    parser.add_argument('--db_name', required=True, help='MongoDB database name')
    parser.add_argument('--collection_name', required=True, help='MongoDB collection name')
    parser.add_argument('--person_name', required=True, help='Name of the offender')
    parser.add_argument('--image_left', required=True, help='Path to the left view image')
    parser.add_argument('--image_right', required=True, help='Path to the right view image')
    parser.add_argument('--image_frontal', required=True, help='Path to the frontal view image')
    parser.add_argument('--upload_folder', default='uploads', help='Directory to store uploaded images')

    args = parser.parse_args()

    # MongoDB Connection
    client = MongoClient(args.db_uri)
    db = client[args.db_name]
    collection = db[args.collection_name]

    # Process and save images and data
    process_uploaded_images(
        collection,
        args.image_left,
        args.image_right,
        args.image_frontal,
        args.person_name,
        args.upload_folder
    )
    print("[INFO] Process completed successfully.")
