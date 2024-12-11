import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto; 
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: Arial, sans-serif;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PageTitle = styled.h2`
  font-size: 2.2rem;
  color: #1a1a2e;
  margin: 0;
`;

const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 1.5rem;
  position: relative;
`;

const AccentBar = styled.div`
  content: "";
  display: block;
  width: 60px;
  height: 5px;
  background: #9f24c2;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const CardHeading = styled.h3`
  color: #1a1a2e;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  font-weight: bold;
`;

const EmptyMessage = styled.p`
  font-size: 1rem;
  color: #999;
  text-align: center;
  margin: 2rem 0;
`;

const ManagerRow = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.05);
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
  }
`;

const ProfileRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CircularAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: url("manager.png") no-repeat center center;
  background-size: cover;
  flex-shrink: 0;
  border: 2px solid #9f24c2;
`;

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UserNameForEmails = styled.h4`
  color: #1a1a2e;
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
`;

const UserRoleForEmails = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const DateAndTimeContainer = styled.div`
  font-size: 0.9rem;
  color: #999;
  display: flex;
  flex-direction: column;
  text-align: right;
`;

const Managers = () => {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/managers");
        setManagers(res.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
        alert("Failed to fetch managers. Please try again.");
      }
    };
    fetchManagers();
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <IconWrapper>
          <img src="/manager.png" alt="Manager Icon" />
        </IconWrapper>
        <PageTitle>Managers</PageTitle>
      </HeaderContainer>

      <CardWrapper>
        <AccentBar />
        <CardHeading>Managers List</CardHeading>
        {managers.length === 0 ? (
          <EmptyMessage>No managers found.</EmptyMessage>
        ) : (
          managers.map((manager) => (
            <ManagerRow key={manager._id}>
              <ProfileRowContainer>
                <CircularAvatar />
                <ProfileDetailsContainer>
                  <UserNameForEmails>{manager.username}</UserNameForEmails>
                  <UserRoleForEmails>Manager</UserRoleForEmails>
                </ProfileDetailsContainer>
              </ProfileRowContainer>
              <DateAndTimeContainer>
                {/* If you have date/time, you can display them here */}
              </DateAndTimeContainer>
            </ManagerRow>
          ))
        )}
      </CardWrapper>
    </Container>
  );
};

export default Managers;
