import React, { useState } from "react";
import styled from "styled-components";
import CreateManager from "./supermanagerutils/CreateManager";

import SuperManagerVideoPage from "./supermanagerutils/SuperManagerVideoPage";

import AnalyticsView from "./supermanagerutils/AnalyticsView";

const App = () => {
  const [activePage, setActivePage] = useState("Analytics");

  const handleLogout = () => {
    window.location.href = "/";
  };

  const pages = {
    Analytics: (
     <AnalyticsView/>
    ),
    "Add Manager": (
      <Card>
        <CardTitle>Add Manager</CardTitle>
        <CreateManager />
      </Card>
    ),
    Logs: (
      <Card>
        <CardImageWrapper>
          <CardImage src="logs.png" alt="Logs" />
        </CardImageWrapper>
        <CardTitle>Logs</CardTitle>
        <CardButton onClick={() => (window.location.href = "/logs")}>
          Get Logs
        </CardButton>
      </Card>
    ),
    "Live Feeds": (
     <SuperManagerVideoPage />
    ),
  };

  return (
    <PageContainer>
      <Sidebar>
        <Logo>SmartGuard</Logo>
        <SidebarNav>
          {Object.keys(pages).map((page) => (
            <SidebarNavLink
              key={page}
              active={activePage === page}
              onClick={() => setActivePage(page)}
            >
              {page}
            </SidebarNavLink>
          ))}
        </SidebarNav>
      </Sidebar>

      <ContentArea>
        <Header>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Header>

        <Main>
          {pages[activePage]}
        </Main>

        
      </ContentArea>
    </PageContainer>
  );
};

// Styled Components



const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
`;

const Sidebar = styled.aside`
  width: 250px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0 0 2rem;
  text-align: center;
`;

const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarNavLink = styled.button`
  background: ${({ active }) => (active ? "#ffffff" : "transparent")};
  color: ${({ active }) => (active ? "#9f24c2" : "#ffffff")};
  border: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #ffffff;
    color: #9f24c2;
    transform: translateY(-2px);
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Header = styled.header`
  
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 2rem;
  background: #9f24c2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled.button`
  background: #ffffff;
  color: #9f24c2;
  border: 2px solid #9f24c2;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  background: #f5f5f5;
  overflow: auto;
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
  padding: 2rem;
  text-align: center;
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 60px;
    height: 5px;
    background: #9f24c2;
    border-radius: 5px;
    margin: 0 auto 1rem auto;
  }
`;

const CardImageWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 1.5rem;
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
`;

const CardTitle = styled.h2`
  color: #1a1a2e;
  margin-bottom: 1.5rem;
`;

const CardButton = styled.button`
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  font-family: inherit;

  &:hover {
    background: #9f24c2;
    box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const Footer = styled.footer`
  background: #ffffff;
  text-align: center;
  padding: 1rem 0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
  font-size: 1rem;
  color: #1a1a2e;
  margin: 0;
`;

export default App;
