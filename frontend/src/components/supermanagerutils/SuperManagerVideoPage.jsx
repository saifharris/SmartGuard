import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import axios from "axios";

const SuperManagerVideoPage = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const parentId = localStorage.getItem("userId"); // Supermanager ID
        if (!parentId) {
          setError("Supermanager ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/auth/videos/managers/${parentId}`
        );

        setManagers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch videos. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <Loading>Loading videos...</Loading>;
  }

  if (error) {
    return <Error>{error}</Error>;
  }

  return (
    <VideoContainer>
      <Header>Manager Videos</Header>
      {managers.length === 0 ? (
        <NoVideos>No videos available</NoVideos>
      ) : (
        managers.map((manager, managerIndex) => (
          <ManagerSection key={managerIndex}>
            <ImageWrapper>
              <ManagerImage
                src="manager.png" // Single image for all managers
                alt="Manager Profile"
              />
            </ImageWrapper>
            <ManagerName>{manager.username}</ManagerName>
            {manager.videoUrls && manager.videoUrls.length > 0 ? (
              <VideoGrid>
                {manager.videoUrls.map((video, index) => (
                  <VideoItem key={index}>
                    <ReactPlayer
                      url={`http://localhost:5000${video}`}
                      controls={false} // Removes controls (including pause button)
                      loop={true} // Enables looping
                      playing={true} // Auto-plays videos
                      muted={true} // Ensures videos are muted initially
                      width="100%"
                      height="100%"
                    />
                  </VideoItem>
                ))}
              </VideoGrid>
            ) : (
              <NoVideos>No videos uploaded</NoVideos>
            )}
          </ManagerSection>
        ))
      )}
    </VideoContainer>
  );
};

// Styled Components
const VideoContainer = styled.div`
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f7f7f7);
  min-height: 100vh;
`;

const Header = styled.h2`
  text-align: center;
  color: #ff6e89;
  font-size: 2rem;
  margin-bottom: 30px;
`;

const ManagerSection = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const ManagerImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ff6e89;
  object-fit: cover;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ManagerName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  background: #ff6e89;
  color: white;
  padding: 10px;
  border-radius: 10px;
  text-transform: capitalize;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const VideoItem = styled.div`
  flex: 1 1 calc(50% - 10px); /* Two videos side by side with a small gap */
  max-width: calc(50% - 10px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%; /* Stack videos vertically on small screens */
    max-width: 100%;
  }
`;

const Loading = styled.div`
  text-align: center;
  color: #ff6e89;
  font-size: 1.5rem;
  margin-top: 50px;
`;

const Error = styled.div`
  text-align: center;
  color: red;
  font-size: 1.2rem;
  margin-top: 50px;
`;

const NoVideos = styled.div`
  text-align: center;
  color: #333;
  font-size: 1.2rem;
  margin-top: 20px;
`;

export default SuperManagerVideoPage;
