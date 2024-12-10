from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import os
from bson.objectid import ObjectId
from datetime import datetime

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

# @app.route("/api/auth/create-manager", methods=["POST"])
# def create_manager():
    data = request.form
    username = data.get("username")
    password = data.get("password")
    parent_id = data.get("parentId")
    video = request.files.get("video")

    if not username or not password or not parent_id:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Save the video if provided
        video_path = None
        if video:
            filename = secure_filename(video.filename)
            video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            video.save(video_path)

        # Create the manager user
        user = {
            "username": username,
            "password": hashed_password,
            "role": "manager",
            "parentId": ObjectId(parent_id),
            "videoUrl": f"/uploads/{filename}" if video else None
        }
        result = users_collection.insert_one(user)

        # Convert the inserted user's ObjectId to string
        user["_id"] = str(result.inserted_id)
        user["parentId"] = str(user["parentId"])  # Convert parentId to string

        return jsonify({"message": "Manager created successfully", "user": user}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
