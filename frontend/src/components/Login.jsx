import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components"; // Import styled-components

// Styled Components
const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px; /* Space between form and image */
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

const FormContainer = styled.form`
  background: linear-gradient(145deg, #1f0933, #2c0f44);
  border-radius: 10px;
  padding: 30px 40px;
  width: 350px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  border: 2px solid #9f24c2;

  input {
    width: 90%;
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
  }

  button {
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
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 400px;
    height: auto;
    object-fit: contain;
    background: transparent;
    border-radius: 10px; /* Optional rounded corners for a polished look */
  }
`;

// Main Component
const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", credentials);

      // Save user details to localStorage
      localStorage.setItem("userId", res.data.id); // Save the user's ID
      localStorage.setItem("role", res.data.role); // Save the user's role
      localStorage.setItem("username", res.data.username); // Save the user's username

      // Set the context
      login(res.data);

      // Redirect based on role
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "supermanager") navigate("/supermanager");
      else if (res.data.role === "manager") navigate("/manager");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <LoginContainer>
      <FormContainer onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </FormContainer>
      <ImageContainer>
        <img src="SmartGuard.png" alt="SmartGuard Logo" />
      </ImageContainer>
    </LoginContainer>
  );
};

export default Login;
