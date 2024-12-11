import React from "react";
import styled from "styled-components";

// Random data generator
const generateRandomData = () => {
  const locations = ["Store A", "Store B", "Store C"];
  const managers = ["John Doe", "Jane Smith", "Sara Lee"];
  const superManagers = ["Michael Knight", "Ella Moore", "David King"];
  const randomId = Math.floor(Math.random() * 1000);
  const location = locations[Math.floor(Math.random() * locations.length)];
  const manager = managers[Math.floor(Math.random() * managers.length)];
  const superManager = superManagers[Math.floor(Math.random() * superManagers.length)];

  return { randomId, location, manager, superManager };
};

// Styled Components
const PageContainer = styled.div`
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #120428, #9f24c2);
  color: #ffffff;
  min-height: 100vh;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffffff;
  color: #9f24c2;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: #9f24c2;
    color: #ffffff;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const LogCard = styled.div`
  background: #1e0632;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #9f24c2;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h3`
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #d4c0e5;
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #2c0a40;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || "#9f24c2"};
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Logs = () => {
  const locationsData = ["Store A", "Store B", "Store C"];

  return (
    <PageContainer>
      <BackButton onClick={() => window.history.back()}>Back</BackButton>
      <GridContainer>
        {locationsData.map((location, index) => {
          const { randomId, manager, superManager } = generateRandomData();

          return (
            <LogCard key={index}>
              <VideoWrapper>
                <VideoElement controls>
                  <source src="a.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </VideoElement>
              </VideoWrapper>
              <InfoSection>
                <Header>
                  <VideoIcon>🎥</VideoIcon>
                  <Title>{location} - Detection Log</Title>
                </Header>
                <InfoText><strong>Detection ID:</strong> {randomId}</InfoText>
                <InfoText><strong>Manager:</strong> {manager}</InfoText>
                <InfoText><strong>Super Manager:</strong> {superManager}</InfoText>
              </InfoSection>
              <ButtonContainer>
                <Button bgColor="#9f24c2">Print</Button>
                <Button bgColor="#120428">Forward</Button>
              </ButtonContainer>
            </LogCard>
          );
        })}
      </GridContainer>
    </PageContainer>
  );
};

export default Logs;
