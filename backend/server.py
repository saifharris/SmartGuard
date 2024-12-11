from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import os
from bson.objectid import ObjectId
from datetime import datetime
# import threading
# import logging
# from recognizeOffender import recognize_from_image
# import subprocess
# import time
# from pathlib import Path

# # Import your configuration and tracker classes
# from config import TrackingConfig
# from multicamtracker import MultiCameraTracker


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all origins (replace '*' with 'http://localhost:5173' for frontend)
bcrypt = Bcrypt(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://harrissaif01:harris999@cluster0.i5ngqeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Cluster0']
users_collection = db['users']

# File upload configuration
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Admin hardcoded credentials
admin_credentials = {"username": "admin", "password": "admin123"}


# # Logging setup
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("MultiCamAPI")





# # Global tracker and worker references
# tracker = None
# worker_thread = None
# processing_done = False

# def run_tracker(video1_path, video2_path, output_path, conf, iou_thresh, cos_thresh):
#     global processing_done, tracker

#     if not os.path.exists(video1_path):
#         logger.error(f"video1_path not found: {video1_path}")
#         processing_done = True
#         return

#     if not os.path.exists(video2_path):
#         logger.error(f"video2_path not found: {video2_path}")
#         processing_done = True
#         return

#     try:
#         config = TrackingConfig(
#             conf_threshold=conf,
#             iou_threshold=iou_thresh,
#             cos_threshold=cos_thresh
#         )
#     except Exception as e:
#         logger.error(f"Failed to create TrackingConfig: {e}")
#         processing_done = True
#         return

#     try:
#         tracker_local = MultiCameraTracker(config)
#     except Exception as e:
#         logger.error(f"Failed to initialize MultiCameraTracker: {e}")
#         processing_done = True
#         return

#     try:
#         tracker_local.process_videos(video1_path, video2_path, output_path)
#         # Assign to global tracker after successful run
#         global tracker
#         tracker = tracker_local
#         processing_done = True
#     except Exception as e:
#         logger.error(f"Error during tracking: {e}")
#         processing_done = True


# #############################################
# #              Tracking Routes (Flask)
# #############################################

# @app.route("/api/start_tracking", methods=["POST"])
# def start_tracking():
#     global worker_thread, processing_done, tracker

#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "Invalid request body"}), 400

#     video1 = data.get("video1")
#     video2 = data.get("video2")
#     output = data.get("output", None)
#     conf = data.get("conf", 0.3)
#     iou_thresh = data.get("iou_thresh", 0.3)
#     cos_thresh = data.get("cos_thresh", 0.8)

#     if not video1 or not os.path.exists(video1):
#         return jsonify({"error": "video1 does not exist."}), 400
#     if not video2 or not os.path.exists(video2):
#         return jsonify({"error": "video2 does not exist."}), 400

#     if worker_thread and worker_thread.is_alive():
#         return jsonify({"error": "Tracking is already in progress."}), 400

#     processing_done = False
#     tracker = None

#     worker_thread = threading.Thread(
#         target=run_tracker,
#         args=(video1, video2, output, conf, iou_thresh, cos_thresh),
#         daemon=True
#     )
#     worker_thread.start()

#     return jsonify({"message": "Tracking started"}), 200

# @app.route("/api/status", methods=["GET"])
# def status():
#     global worker_thread, processing_done, tracker
#     if worker_thread is None:
#         return jsonify({"status": "not started"}), 200
#     elif worker_thread.is_alive():
#         return jsonify({"status": "processing"}), 200
#     else:
#         if tracker:
#             return jsonify({"status": "done", "total_visits": tracker.total_visit_count}), 200
#         else:
#             return jsonify({"status": "failed", "message": "Tracker did not complete successfully"}), 200



# #############################################
# #              searchByImage(Flask)
# #############################################


# UPLOAD_DIR = Path("uploads")
# UPLOAD_DIR.mkdir(exist_ok=True)
# UPLOAD_FOLDER = 'searchPerson'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)



# UPLOAD_FOLDER2 = os.path.join(os.getcwd(), 'uploads')
# app.config['UPLOAD_FOLDER2'] = UPLOAD_FOLDER2
# os.makedirs(UPLOAD_FOLDER2, exist_ok=True)


# @app.route("/upload", methods=["POST"])
# def upload_images():
#     # Validate person_name
#     person_name = request.form.get("person_name")
#     if not person_name:
#         return jsonify({"detail": "Person name not provided."}), 400

#     # Check that exactly 3 images are uploaded
#     if "images" not in request.files:
#         return jsonify({"detail": "Please upload exactly 3 images."}), 400

#     images = request.files.getlist("images")
#     if len(images) != 3:
#         return jsonify({"detail": "Please upload exactly 3 images."}), 400

#     image_paths = []
#     for img in images:
#         # Generate a unique filename by using the current timestamp and the original filename
#         timestamp = int(time.time() * 1000)  # current time in milliseconds
#         out_filename = f"{timestamp}-{secure_filename(img.filename)}"
#         out_path = UPLOAD_DIR / out_filename

#         # Save the uploaded file to the uploads directory
#         img.save(out_path)
#         image_paths.append(str(out_path.resolve()))

#     # Ensure the dataset directory exists
#     dataset_dir = Path("dataset_and_files") / "dataset" / person_name
#     dataset_dir.mkdir(parents=True, exist_ok=True)

#     # MongoDB details
#     db_uri = "mongodb+srv://harrissaif01:harris999@cluster0.i5ngqeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
#     db_name = "SmartGuard"
#     collection_name = "knownOffenders"
#     upload_folder = "uploads"

#     # 0. Run storeOffender.py
#     saveOffenderCommand = [
#         "python",
#         "storeOffender.py",
#         "--db_uri", db_uri,
#         "--db_name", db_name,
#         "--collection_name", collection_name,
#         "--person_name", person_name,
#         "--image_left", image_paths[0],
#         "--image_right", image_paths[1],
#         "--image_frontal", image_paths[2],
#         "--upload_folder", upload_folder
#     ]

#     result = subprocess.run(saveOffenderCommand, capture_output=True, text=True)
#     if result.returncode != 0:
#         print("[ERROR] Running storeOffender.py:", result.stderr)
#         return jsonify({"detail": "Error saving offender details to MongoDB."}), 500

#     print("[INFO] Offender details saved successfully.")

#     # 1. Run augmentation.py
#     augmentationCommand = [
#         "python",
#         "augmentation.py",
#         "--person_name", person_name,
#         "--images", *image_paths,
#         "--output_dir", str(dataset_dir.resolve())
#     ]

#     result = subprocess.run(augmentationCommand, capture_output=True, text=True)
#     if result.returncode != 0:
#         print("[ERROR] Running augmentation.py:", result.stderr)
#         return jsonify({"detail": "Error during augmentation."}), 500

#     print("[INFO] Dataset augmentation complete. Starting training...")

#     # 2. Run train.py
#     trainCommand = ["python", "train.py"]
#     result = subprocess.run(trainCommand, capture_output=True, text=True)
#     if result.returncode != 0:
#         print("[ERROR] Running train.py:", result.stderr)
#         return jsonify({"detail": "Error during training."}), 500

#     print("[INFO] Training complete. Starting main.py for real-time recognition...")

#     # 3. Run main.py
#     mainCommand = ["python", "main2.py"]
#     result = subprocess.run(mainCommand, capture_output=True, text=True)
#     if result.returncode != 0:
#         print("[ERROR] Running main.py:", result.stderr)
#         return jsonify({"detail": "Error starting real-time recognition."}), 500

#     return jsonify({
#         "message": "Offender saved to MongoDB, augmentation, training, and real-time recognition completed."
#     })


# @app.route("/run-main", methods=["GET"])
# def run_main():
#     print("[INFO] Starting main2.py")
#     mainCommand = ["python", "main2.py"]
#     result = subprocess.run(mainCommand, capture_output=True, text=True)
#     if result.returncode != 0:
#         print("[ERROR] Running main2.py:", result.stderr)
#         return jsonify({"detail": "Error running main.py"}), 500

#     return jsonify({
#         "message": "main2.py executed successfully!",
#         "output": result.stdout,
#     })

# @app.route('/upload-image', methods=['POST'])
# def upload_image():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No file uploaded'}), 400

#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({'error': 'No file selected'}), 400

#     # Save the uploaded image
#     filename = secure_filename(file.filename)
#     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     file.save(file_path)

#     try:
#         result = recognize_from_image(file_path)
#         if result:
#             if result.get('name') and result.get('date') and result.get('images'):
#                 # Replace backslashes with forward slashes for web compatibility
#                 for key in result['images']:
#                     if result['images'][key]:
#                         result['images'][key] = request.host_url.strip('/') + result['images'][key].replace('\\', '/')

#                 print(f"Recognized Offender: {result['images']}")

#                 return jsonify(result)
#             else:
#                 return jsonify({
#                     'status': 'success',
#                     'message': 'Offender recognized but data is incomplete.'
#                 })
#         else:
#             return jsonify({
#                 'status': 'success',
#                 'message': 'No offender recognized'
#             })
#     except Exception as e:
#         print(f"Error occurred: {e}")
#         return jsonify({'error': str(e)}), 500
#     finally:
#         os.remove(file_path)

# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER2'], filename)






#############################################
#             userManager (Flask)
#############################################




# Serve uploaded files
@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Routes

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    # Check admin credentials
    if username == admin_credentials["username"] and password == admin_credentials["password"]:
        return jsonify({"role": "admin", "username": username}), 200

    # Check user credentials
    user = users_collection.find_one({"username": username})
    if user and bcrypt.check_password_hash(user["password"], password):
        return jsonify({"role": user["role"], "username": user["username"], "id": str(user["_id"])}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/auth/register", methods=["POST"])
def register_user():
    data = request.form
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    parent_id = data.get("parentId")
    video = request.files.get("video")

    if not username or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Save video if provided
    video_path = None
    if video:
        filename = secure_filename(video.filename)
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video.save(video_path)

    # Insert into database
    user = {
        "username": username,
        "password": hashed_password,
        "created_at": datetime.utcnow(),   # Add current date and time in UTC
        "role": role,
        "parentId": ObjectId(parent_id) if parent_id else None,
        "videoUrl": f"/uploads/{filename}" if video else None,
        
    }
    
    result = users_collection.insert_one(user)
    
    
    
    user["_id"] = str(result.inserted_id)  # Convert ObjectId to string
    return jsonify({"message": "User created successfully", "user": user}), 201

@app.route("/api/auth/create-supermanager", methods=["POST"])
def create_supermanager():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    user = {
        "username": username,
        "password": hashed_password,
        "role": "supermanager",
        "parentId": None,
        "videoUrl": None,
        "created_at": datetime.utcnow()  # Add current date and time in UTC
    }
    result = users_collection.insert_one(user)
    user["_id"] = str(result.inserted_id)  # Convert ObjectId to string
    return jsonify({"message": "Supermanager created successfully", "user": user}), 201


@app.route("/api/auth/create-manager", methods=["POST"])
def create_manager():
    data = request.form
    username = data.get("username")
    password = data.get("password")
    parent_id = data.get("parentId")
    videos = request.files.getlist("videos")  # Get list of videos
   

    if not username or not password or not parent_id:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Check if manager with the same username already exists
        existing_manager = users_collection.find_one({"username": username})
        if existing_manager:
            return jsonify({"error": "Manager with this username already exists"}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Limit video uploads to 2
        if len(videos) > 2:
            return jsonify({"error": "Only up to two videos can be uploaded"}), 400

        # Save the videos if provided
        video_urls = []
        for video in videos:
            filename = secure_filename(video.filename)
            video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            video.save(video_path)
            video_urls.append(f"/uploads/{filename}")

        # Create the manager user
        user = {
            "username": username,
            "password": hashed_password,
            "role": "manager",
            "parentId": ObjectId(parent_id),
            "videoUrls": video_urls  # Store list of video URLs
        }
        result = users_collection.insert_one(user)

        # Convert the inserted user's ObjectId to string
        user["_id"] = str(result.inserted_id)
        user["parentId"] = str(user["parentId"])  # Convert parentId to string

        return jsonify({"message": "Manager created successfully", "user": user}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/managers/<string:parent_id>", methods=["GET"])
def get_managers(parent_id):
    try:
        managers = list(users_collection.find({"parentId": ObjectId(parent_id), "role": "manager"}))
        for manager in managers:
            manager["_id"] = str(manager["_id"])  # Convert ObjectId to string
            if manager["parentId"]:
                manager["parentId"] = str(manager["parentId"])  # Convert parentId to string
        return jsonify(managers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/videos/managers/<string:parent_id>", methods=["GET"])
def get_manager_videos(parent_id):
    try:
        managers = list(users_collection.find({"parentId": ObjectId(parent_id), "role": "manager"}))
        for manager in managers:
            manager["_id"] = str(manager["_id"])  # Convert ObjectId to string
            if manager["parentId"]:
                manager["parentId"] = str(manager["parentId"])  # Convert parentId to string
        return jsonify(managers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#     try:
#         manager = users_collection.find_one({"_id": ObjectId(manager_id)})
#         if not manager:
#             return jsonify({"error": "Manager not found"}), 404
#         manager["_id"] = str(manager["_id"])  # Convert ObjectId to string
#         return jsonify(manager), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/auth/video/manager/<string:manager_id>", methods=["GET"])
# def get_own_video(manager_id):
#     try:
#         # Validate manager_id as ObjectId
#         if not ObjectId.is_valid(manager_id):
#             return jsonify({"error": "Invalid manager ID"}), 400

#         # Query the database
#         manager = users_collection.find_one({"_id": ObjectId(manager_id)})
#         if not manager:
#             return jsonify({"error": "Manager not found"}), 404

#         # Convert ObjectId to string and return the manager's video URL
#         manager["_id"] = str(manager["_id"])
#         if manager.get("videoUrl"):
#             return jsonify({"username": manager["username"], "videoUrl": manager["videoUrl"]}), 200
#         else:
#             return jsonify({"error": "No video uploaded for this manager"}), 404
#     except Exception as e:
#         return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/api/auth/video/manager/<string:manager_id>", methods=["GET"])
def get_own_video(manager_id):
    try:
        # Validate manager_id as ObjectId
        if not ObjectId.is_valid(manager_id):
            return jsonify({"error": "Invalid manager ID"}), 400

        # Query the database
        manager = users_collection.find_one({"_id": ObjectId(manager_id)})
        if not manager:
            return jsonify({"error": "Manager not found"}), 404

        # Convert ObjectId to string and return the manager's video URLs
        manager["_id"] = str(manager["_id"])
        return jsonify({
            "username": manager["username"],
            "videoUrls": manager.get("videoUrls", [])
        }), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/api/auth/counts", methods=["GET"])
def get_counts():
    try:
        supermanagers_count = users_collection.count_documents({"role": "supermanager"})
        managers_count = users_collection.count_documents({"role": "manager"})
        return jsonify({
            "supermanagers": supermanagers_count,
            "managers": managers_count
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/supermanagers", methods=["GET"])
def get_all_supermanagers():
    try:
        # Fetch supermanagers with username and created_at
        supermanagers = list(users_collection.find({"role": "supermanager"}, {"username": 1, "created_at": 1}))
        
        # Ensure created_at is formatted and fallback for missing dates
        for sm in supermanagers:
            sm["_id"] = str(sm["_id"])  # Convert ObjectId to string
            if "created_at" in sm and sm["created_at"]:  # If created_at exists
                # Format created_at to YYYY-MM-DD
                sm["created_at"] = sm["created_at"].strftime("%Y-%m-%d")
            else:
                sm["created_at"] = "Unknown Date"  # Fallback for missing dates
        
        return jsonify(supermanagers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/api/auth/managers", methods=["GET"])
def get_all_managers():
    try:
        # Fetch managers with username and created_at
        managers = list(users_collection.find({"role": "manager"}, {"username": 1, "created_at": 1}))
        
        # Ensure created_at is formatted and fallback for missing dates
        for manager in managers:
            manager["_id"] = str(manager["_id"])  # Convert ObjectId to string
            if "created_at" in manager and manager["created_at"]:  # If created_at exists
                # Format created_at to YYYY-MM-DD
                manager["created_at"] = manager["created_at"].strftime("%Y-%m-%d")
            else:
                manager["created_at"] = "Unknown Date"  # Fallback for missing dates
        
        return jsonify(managers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(port=5000, debug=True)
