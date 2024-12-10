import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components"; // Import styled-components
import Loader from "./utils/Loader.jsx"; // Import the Loader component

// Styled Components
const DashboardContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FAFAFA;
  color: #ffffff;
  padding: 20px;
`;

const Heading = styled.h2`
  color: #9f24c2;
  margin-bottom: 20px;
`;

const Form = styled.form`
  background: linear-gradient(145deg, #1f0933, #2c0f44);
  border-radius: 10px;
  padding: 30px 40px;
  width: 350px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  border: 2px solid #9f24c2;
`;

const Input = styled.input`
  width: 91%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 2px solid #9f24c2;
  border-radius: 5px;
  background-color: #2b103d;
  color: #ffffff;
  font-size: 16px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #d368f5;
    background-color: #3d1450;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 15px;
  background: #9f24c2;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #d368f5;
    transform: scale(1.05);
  }
`;

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true); // State to control the loader

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const handleCreateSuperManager = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/create-supermanager", formData);
      alert("SuperManager created successfully!");
      setFormData({ username: "", password: "" });
    } catch (error) {
      console.error("Error creating supermanager:", error);
      alert("Failed to create SuperManager.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashboardContainer>
      <Heading>Admin Dashboard</Heading>
      <Form onSubmit={handleCreateSuperManager}>
        <Input
          type="text"
          placeholder="SuperManager Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="SuperManager Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button type="submit">Create SuperManager</Button>
      </Form>
    </DashboardContainer>
  );
};



export default AdminDashboard;

