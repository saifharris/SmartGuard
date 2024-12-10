import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled components
const GradientBoxForEmails = styled.div`
  background: linear-gradient(145deg, #ff5f7e, #ffe1e6);
  border-radius: 20px;
  padding: 20px;
  width: 500px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: Arial, sans-serif;
`;

const HeadingForEmails = styled.h2`
  color: #333;
  font-size: 20px;
  margin: 0;
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
`;

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

const UserNameForEmails = styled.h3`
  color: #333;
  font-size: 18px;
  margin: 0;
`;

const UserRoleForEmails = styled.span`
  font-size: 14px;
  color: #666;
`;

const DateAndTimeContainer = styled.div`
  font-size: 14px;
  color: #999;
  display: flex;
  flex-direction: column;
  text-align: right;
`;

const SingleEmailRow = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Smanagers = () => {
    const [supermanagers, setSupermanagers] = useState([]);
  
    useEffect(() => {
      const fetchSupermanagers = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/supermanagers");
          setSupermanagers(res.data); // Set the fetched supermanagers
        } catch (error) {
          console.error("Error fetching supermanagers:", error);
          alert("Failed to fetch supermanagers. Please try again.");
        }
      };
  
      fetchSupermanagers();
    }, []);
  
    return (
        <><span>
        <img src="/super.png" alt="" style={{ width: "120px", height: "120px" }} />
      </span>
      <span style={{ fontWeight: 900, fontSize: "36px", color: "#232b2b" }}>
        Supermanagers
      </span>
      <GradientBoxForEmails>
        <HeadingForEmails>Supermanagers</HeadingForEmails>
        {supermanagers.length === 0 ? (
          <p>No supermanagers found.</p>
        ) : (
          supermanagers.map((sm) => (
            <SingleEmailRow key={sm._id}>
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
            </SingleEmailRow>
          ))
        )}
      </GradientBoxForEmails>
      
      </>
      
    );
  };
  
  export default Smanagers;
  