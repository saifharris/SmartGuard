import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";

const SuperManagerDashboard = () => {
  const [managers, setManagers] = useState([]); // List of managers
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    video: null,
  }); // Data for creating a manager

  useEffect(() => {
    const fetchManagersWithVideos = async () => {
      try {
        const parentId = localStorage.getItem("userId"); // Get supermanager ID from localStorage
        if (!parentId) {
          console.error("Missing supermanager ID");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/auth/videos/managers/${parentId}`);
        setManagers(res.data); // Set the fetched managers
      } catch (error) {
        console.error("Error fetching managers:", error);
        alert("Failed to fetch managers. Please try again.");
      }
    };

    fetchManagersWithVideos();
  }, []);

  const handleCreateManager = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("parentId", localStorage.getItem("userId")); // Include supermanager ID
      if (formData.video) {
        formDataToSend.append("video", formData.video); // Attach video file
      }

      const res = await axios.post("http://localhost:5000/api/auth/create-manager", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Manager created successfully!");
      setManagers((prevManagers) => [...prevManagers, res.data.user]); // Add the new manager to the list
      setFormData({ username: "", password: "", video: null }); // Reset the form
    } catch (error) {
      console.error("Error creating manager:", error);
      alert("Failed to create manager. Please try again.");
    }
  };

  return (
    <div>
      <h2>SuperManager Dashboard</h2>

      <h3>Create Manager</h3>
      <form onSubmit={handleCreateManager}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter manager username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter manager password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
          />
        </div>

        <button type="submit">Create Manager</button>
      </form>

      <h3>Managers List</h3>
      <ul>
        {managers.length === 0 ? (
          <p>No managers created yet.</p>
        ) : (
          managers.map((manager) => (
            <li key={manager._id}>
              <h4>{manager.username}</h4>
              {manager.videoUrl ? (
                <ReactPlayer url={`http://localhost:5000/${manager.videoUrl}`} controls />
              ) : (
                <p>No video uploaded</p>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SuperManagerDashboard;
