import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

// Styled Components
const PageContainer = styled.div`
  height: 100vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  max-width: 1200px;
  width: 100%;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  padding: 40px;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.2);
`;

const FormContainer = styled.form`
  background: linear-gradient(145deg, #1f0933, #2c0f44);
  border-radius: 10px;
  padding: 40px;
  width: 350px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  border: 2px solid #9f24c2;

  h2 {
    color: #ffffff;
    margin-bottom: 20px;
    font-size: 1.8rem;
    font-weight: bold;
  }

  p {
    color: #d3cce3;
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  input {
    width: 90%;
    padding: 14px;
    margin-bottom: 15px;
    border: 2px solid #9f24c2;
    border-radius: 8px;
    background-color: #2b103d;
    color: #ffffff;
    font-size: 16px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    font-family: inherit;

    &::placeholder {
      color: #bba0c9;
    }

    &:focus {
      outline: none;
      border-color: #d368f5;
      background-color: #3d1450;
    }
  }

  button {
    width: 100%;
    padding: 14px;
    background: #9f24c2;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    font-family: inherit;

    &:hover {
      background: #d368f5;
      transform: translateY(-2px);
      box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 400px;
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    filter: drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2));
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
      localStorage.setItem("userId", res.data.id); 
      localStorage.setItem("role", res.data.role); 
      localStorage.setItem("username", res.data.username); 

      // Set the context
      login(res.data);

      // Redirect based on role
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "supermanager") navigate("/supermanager");
      else if (res.data.role === "manager") navigate("/manager");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Check your credentials and try again.");
    }
  };

  return (
    <PageContainer>
      <LoginContainer>
        <FormContainer onSubmit={handleLogin}>
          <h2>SmartGuard</h2>
          <p>Please enter your credentials to log in.</p>
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
    </PageContainer>
  );
};

export default Login;
