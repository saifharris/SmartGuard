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
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
  background: linear-gradient(135deg, #ff97aa, #bef4ff);
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 250px;
  background-color: #333;
  border-radius: 10px;
  position: relative;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const InfoSection = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  margin-top: -20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const VideoIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #ff97aa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const Info = styled.div`
  margin-bottom: 10px;
`;

const InfoText = styled.p`
  font-size: 14px;
  margin: 5px 0;
  color: #444;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || "#ff97aa"};
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Logs = () => {
  // Array of locations for rendering the logs for each location
  const locationsData = ["Store A", "Store B", "Store C"];
  
  return (
    <div>
      {locationsData.map((location, index) => {
        const { randomId, manager, superManager } = generateRandomData();

        return (
          <Container key={index}>
            <VideoWrapper>
              {/* Replace the src with your actual video source */}
              <VideoElement controls>
                <source src="a.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </VideoElement>
            </VideoWrapper>

            <InfoSection>
              <Header>
                <VideoIcon>🎥</VideoIcon>
                <Title>Shoplifting Detection Log - {location}</Title>
              </Header>

              <Info>
                <InfoText><strong>Detection ID:</strong> {randomId}</InfoText>
                <InfoText><strong>Location:</strong> {location}</InfoText>
                <InfoText><strong>Manager:</strong> {manager}</InfoText>
                <InfoText><strong>Super Manager:</strong> {superManager}</InfoText>
              </Info>

              <ButtonContainer>
                <Button bgColor="#ff97aa">Print</Button>
                <Button bgColor="#bef4ff">Forward</Button>
              </ButtonContainer>
            </InfoSection>
          </Container>
        );
      })}
    </div>
  );
};

export default Logs;
