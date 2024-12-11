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
    <PageContainer>
      <Title>Manager Videos</Title>
      {managers.length === 0 ? (
        <NoVideos>No videos available</NoVideos>
      ) : (
        managers.map((manager, managerIndex) => (
          <ManagerCard key={managerIndex}>
            <CardAccentBar />
            <ManagerHeader>
              <ImageWrapper>
                <ManagerImage
                  src="manager.png" // Single image for all managers
                  alt="Manager Profile"
                />
              </ImageWrapper>
              <ManagerName>{manager.username}</ManagerName>
            </ManagerHeader>
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
          </ManagerCard>
        ))
      )}
    </PageContainer>
  );
};

// Styled Components

const PageContainer = styled.div`
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
`;

const Title = styled.h2`
  text-align: center;
  color: #1a1a2e;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ManagerCard = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  text-align: center;
`;

const CardAccentBar = styled.div`
  content: "";
  display: block;
  width: 60px;
  height: 5px;
  background: #9f24c2;
  border-radius: 5px;
  margin: 0 auto 1.5rem auto;
`;

const ManagerHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ImageWrapper = styled.div`
  margin-bottom: 1rem;
`;

const ManagerImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #9f24c2;
  object-fit: cover;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ManagerName = styled.h3`
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 0;
  font-weight: bold;
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const VideoItem = styled.div`
  flex: 1 1 calc(50% - 1rem); /* Two videos per row */
  max-width: calc(50% - 1rem);
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%; /* Stack videos vertically on small screens */
    max-width: 100%;
  }
`;

const Loading = styled.div`
  text-align: center;
  color: #9f24c2;
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
  color: #1a1a2e;
  font-size: 1.2rem;
  margin-top: 20px;
`;

export default SuperManagerVideoPage;
