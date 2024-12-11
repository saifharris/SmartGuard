import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import styled from "styled-components";

const DashboardContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #ffffff; /* Set background to white */
  color: #000000; /* Adjust text color for better contrast */
  min-height: 100vh;
  padding: 20px;
`;

const Navbar = styled.nav`
  background: #1f0933;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  margin-bottom: 30px;

  h2 {
    color: #d368f5;
    font-size: 24px;
    margin: 0;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 15px;
    margin: 0;

    li {
      display: inline-block;

      a {
        text-decoration: none;
        color: #ffffff;
        font-size: 16px;
        padding: 8px 15px;
        border-radius: 5px;
        transition: background 0.3s ease, color 0.3s ease;

        &:hover {
          background: #d368f5;
          color: #1f0933;
        }
      }
    }
  }
`;

const WelcomeMessage = styled.h3`
  color: #d368f5;
  margin-bottom: 20px;
  text-align: center;
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: nowrap; /* Ensure videos are side by side */
  justify-content: center; /* Center the videos */
  gap: 5px; /* Add spacing between videos */
  padding: 20px;
`;

const VideoCard = styled.div`
  width: 45%; /* Adjust width for better alignment */
  aspect-ratio: 16/9; /* Maintain a 16:9 ratio for video container */
  background: #f0f0f0; /* Light grey background for video cards */
  border-radius: 10px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
    transition: all 0.3s ease;
    box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: "CCTV Feed";
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 5px;
    border-radius: 5px;
  }
`;

const StyledReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const NoVideosMessage = styled.p`
  color: #000000;
  font-size: 18px;
  text-align: center;
  margin-top: 50px;
`;

const TrackButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background: #d368f5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #c257e0;
    transform: scale(1.05);
  }
`;

const ManagerDashboard = () => {
  const [videoUrls, setVideoUrls] = useState([]); // Manager's video URLs
  const [username, setUsername] = useState(""); // Manager's username
  const [video1, setVideo1] = useState(null);
  const [video2, setVideo2] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManagerVideos = async () => {
      try {
        const managerId = localStorage.getItem("userId"); // Get manager ID from localStorage
        if (!managerId) {
          console.error("Manager ID not found in localStorage");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/auth/video/manager/${managerId}`
        );
        setVideoUrls(res.data.videoUrls || []); // Set video URLs
        setUsername(res.data.username); // Set username

        if (res.data.videoUrls.length > 0) {
          setVideo1(res.data.videoUrls[0]);
          setVideo2(res.data.videoUrls[1] || null);
        }
      } catch (error) {
        console.error("Error fetching manager videos:", error);
        alert("Failed to fetch your videos. Please contact your supermanager.");
      }
    };

    fetchManagerVideos();
  }, []);

  const startTracking = async () => {
    if (!video1 || !video2) {
      alert("Please ensure at least two videos are available for tracking.");
      return;
    }
  
    // Add a '.' in front of the paths if they start with '/'
    let adjustedVideo1 = video1;
    let adjustedVideo2 = video2;
  
    if (video1.startsWith('/')) {
      adjustedVideo1 = '.' + video1;
    }
    if (video2.startsWith('/')) {
      adjustedVideo2 = '.' + video2;
    }
  
    console.log("Starting tracking with videos:", adjustedVideo1, adjustedVideo2);
  
    const payload = {
      video1: adjustedVideo1,
      video2: adjustedVideo2,
      output: "output.avi",
      conf: 0.3,
      iou_thresh: 0.3,
      cos_thresh: 0.8
    };
  
    setLoading(true);
    try {

      console.log("Payload:", payload);

      const response = await axios.post("http://localhost:5000/api/start_tracking", payload);
      alert("Tracking started successfully: " + response.data.message);
    } catch (error) {
      console.error("Error starting tracking:", error);
      alert("Failed to start tracking. Please check the video paths and server.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <DashboardContainer>
      {/* <Navbar>
        <h2>Manager Dashboard</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </Navbar> */}
     
      {videoUrls.length > 0 ? (
        <>
          <VideoGrid>
            {videoUrls.map((url, index) => (
              <VideoCard key={index}>
                <StyledReactPlayer
                  url={`http://localhost:5000${url}`}
                  playing={true} // Auto-play video
                  loop={true} // Loop the video
                  muted={true} // Mute the video for a clean viewing experience
                  controls={false} // Remove play button and controls
                />
              </VideoCard>
            ))}
          </VideoGrid>
          <TrackButton onClick={startTracking} disabled={loading}>
            {loading ? "Starting Tracking..." : "Start Tracking"}
          </TrackButton>
        </>
      ) : (
        <NoVideosMessage>No videos assigned to you yet.</NoVideosMessage>
      )}
    </DashboardContainer>
  );
};

export default ManagerDashboard;
