import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled components
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
  background: url("super.png") no-repeat center center;
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

const Smanagers = () => {
  const [supermanagers, setSupermanagers] = useState([]);

  useEffect(() => {
    const fetchSupermanagers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/supermanagers");
        setSupermanagers(res.data);
      } catch (error) {
        console.error("Error fetching supermanagers:", error);
        alert("Failed to fetch supermanagers. Please try again.");
      }
    };

    fetchSupermanagers();
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <IconWrapper>
          <img src="/super.png" alt="Super Manager Icon" />
        </IconWrapper>
        <PageTitle>Supermanagers</PageTitle>
      </HeaderContainer>

      <CardWrapper>
        <AccentBar />
        <CardHeading>Supermanagers List</CardHeading>
        {supermanagers.length === 0 ? (
          <EmptyMessage>No supermanagers found.</EmptyMessage>
        ) : (
          supermanagers.map((sm) => (
            <ManagerRow key={sm._id}>
              <ProfileRowContainer>
                <CircularAvatar />
                <ProfileDetailsContainer>
                  <UserNameForEmails>{sm.username}</UserNameForEmails>
                  <UserRoleForEmails>Supermanager</UserRoleForEmails>
                </ProfileDetailsContainer>
              </ProfileRowContainer>
              <DateAndTimeContainer>
                <span>{sm.created_at || "Unknown Date"}</span>
              </DateAndTimeContainer>
            </ManagerRow>
          ))
        )}
      </CardWrapper>
    </Container>
  );
};

export default Smanagers;
