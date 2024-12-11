import React from "react";
import styled from "styled-components";
import CreateManager from "./supermanagerutils/CreateManager";

const App = () => {
  const navigateToAnalytics = () => {
    window.location.href = "/analytics";
  };

  const navigateToLearnMore = () => {
    window.location.href = "/creatingmanager";
  };

  const navigateToExploreServices = () => {
    window.location.href = "/logs";
  };

  const navigateToContactUs = () => {
    window.location.href = "/videos";
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar>
        <NavLinks>
          <NavLink href="#home">Analytics</NavLink>
          <NavLink href="#about">Add Manager</NavLink>
          <NavLink href="#services">Logs</NavLink>
          <NavLink href="#contact">Live Feeds</NavLink>
        </NavLinks>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Navbar>
      <Page id="home">
        <Wrapper>
          <ImageWrapper>
            <Image src="analytics.png" alt="Analytics" />
            <Button onClick={navigateToAnalytics}>Analytics</Button>
          </ImageWrapper>
        </Wrapper>
      </Page>
      <Page id="about">
        <CreateManager />
      </Page>
      <Page id="services">
        <Wrapper>
          <ImageWrapper>
            <Image src="logs.png" alt="Services" />
            <Button onClick={navigateToExploreServices}>Get Logs</Button>
          </ImageWrapper>
        </Wrapper>
      </Page>
      <Page id="contact">
        <Wrapper>
          <ImageWrapper>
            <Image src="feed.png" alt="Contact Us" />
            <Button onClick={navigateToContactUs}>Live Feeds</Button>
          </ImageWrapper>
        </Wrapper>
      </Page>
      <Footer>
        <FooterText>© 2024 Your Company Name. All rights reserved.</FooterText>
      </Footer>
    </div>
  );
};

// Styled Components
const Navbar = styled.nav`
  position: sticky;
  top: 0;
  background: #120428;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 65%;
`;

const NavLink = styled.a`
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #9f24c2;
  padding: 10px 20px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #9f24c2;
    color: white;
  }
`;

const LogoutButton = styled.button`
  background: #9f24c2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #9f24c2;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
`;

const Page = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: ${(props) =>
    props.id === "home"
      ? "linear-gradient(180deg, #9f24c2, #120428)"
      : props.id === "about"
      ? "linear-gradient(180deg, #120428, #9f24c2)"
      : props.id === "services"
      ? "linear-gradient(180deg, #9f24c2, #120428)"
      : "linear-gradient(180deg, #120428, #9f24c2)"};
  color: #fff;
  padding: 20px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    line-height: 1.6;
  }
`;

const Wrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0;
  max-width: 600px;
  max-height: 400px;
  width: 100%;
  height: auto;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Button = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #9f24c2, #120428);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #9f24c2;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
`;

const Footer = styled.footer`
  background: #120428;
  color: #fff;
  text-align: center;
  padding: 20px 0;
  margin-top: auto;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.3);
`;

const FooterText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

export default App;
