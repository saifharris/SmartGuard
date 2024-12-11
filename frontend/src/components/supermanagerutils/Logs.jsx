import React from "react";
import styled from "styled-components";

const LogsPageContainer = styled.div`
  padding: 20px;
  font-family: "Arial", sans-serif;
  background: linear-gradient(145deg, #f5f5f5, #f0f0f0);
  color: #1a1a2e;
  min-height: 100vh;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #9f24c2;
  color: #ffffff;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #b561d2;
  }
`;

const LogsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const LogCard = styled.div`
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 200px;
  background-color: #000;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoSection = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const VideoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #9f24c2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-right: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  font-size: 18px;
  color: #1a1a2e;
  font-weight: bold;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #555555;
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || "#9f24c2"};
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#b561d2"};
  }
`;

const Logs = () => {
  const locationsData = ["Store A", "Store B", "Store C"];

  return (
    <LogsPageContainer>
      {/* <BackButton onClick={() => window.history.back()}>Back</BackButton> */}
      <LogsGrid>
        {locationsData.map((location, index) => {
          const randomId = Math.floor(Math.random() * 1000);
          const manager = `Manager ${index + 1}`;
          const superManager = `Super Manager ${index + 1}`;

          return (
            <LogCard key={index}>
              <VideoWrapper>
                <VideoElement controls>
                  <source src="cam11.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </VideoElement>
              </VideoWrapper>
              <InfoSection>
                <Header>
                  <VideoIcon>🎥</VideoIcon>
                  <Title>{location} - Detection Log</Title>
                </Header>
                <InfoText>
                  <strong>Detection ID:</strong> {randomId}
                </InfoText>
                <InfoText>
                  <strong>Manager:</strong> {manager}
                </InfoText>
                <InfoText>
                  <strong>Super Manager:</strong> {superManager}
                </InfoText>
              </InfoSection>
              <ButtonContainer>
                <Button bgColor="#9f24c2" hoverColor="#b561d2">
                  Print
                </Button>
                <Button bgColor="#1a1a2e" hoverColor="#333333">
                  Forward
                </Button>
              </ButtonContainer>
            </LogCard>
          );
        })}
      </LogsGrid>
    </LogsPageContainer>
  );
};

export default Logs;
