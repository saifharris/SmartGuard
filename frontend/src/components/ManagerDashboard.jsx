import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";

const ManagerDashboard = () => {
  const [videoUrl, setVideoUrl] = useState(null); // Manager's video URL
  const [username, setUsername] = useState(""); // Manager's username

  useEffect(() => {
    const fetchManagerVideo = async () => {
      try {
        const managerId = localStorage.getItem("userId"); // Get manager ID from localStorage
        if (!managerId) {
          console.error("Manager ID not found in localStorage");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/auth/video/manager/${managerId}`);
        setVideoUrl(res.data.videoUrl); // Set video URL
        setUsername(res.data.username); // Set username
      } catch (error) {
        console.error("Error fetching manager video:", error);
        alert("Failed to fetch your video. Please contact your supermanager.");
      }
    };

    fetchManagerVideo();
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <h3>Welcome, {username}</h3>
      {videoUrl ? (
        <ReactPlayer url={`http://localhost:5000/${videoUrl}`} controls />
      ) : (
        <p>No video assigned to you yet.</p>
      )}
    </div>
  );
};

export default ManagerDashboard;
