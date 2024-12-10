import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const CreateManager = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    videos: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("parentId", localStorage.getItem("userId")); // Supermanager ID
      formData.videos.forEach((video) => {
        formDataToSend.append("videos", video);
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/create-manager",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccessMessage("Manager created successfully!");
      setFormData({ username: "", password: "", videos: [] }); // Reset the form
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to create manager. Please try again."
      );
    }
  };

  return (
    <Form onSubmit={handleCreateManager}>
      <h3>Create Manager</h3>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <div>
        <label>Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Upload Videos (Max 2)</label>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) =>
            setFormData({ ...formData, videos: [...e.target.files] })
          }
        />
      </div>
      <button type="submit">Create Manager</button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(145deg, #ece9f0, #ffffff);
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.2), inset 0px -2px 10px rgba(255, 255, 255, 0.5);
  max-width: 600px; /* Increased the width */
  margin: 20px auto;

  h3 {
    font-size: 2.2rem; /* Increased heading size */
    margin-bottom: 20px;
    color: #4a4e69;
    text-align: center;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  div {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 10px;
      font-size: 1.2rem; /* Increased label size */
      color: #22223b;
      font-weight: bold;
    }

    input {
      width: calc(100% - 20px); /* Added horizontal padding */
      padding: 15px;
      margin: 0 10px; /* Space on left and right */
      border: none;
      border-radius: 8px;
      font-size: 1.1rem; /* Larger font size */
      background: #f4f4f8;
      box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease, transform 0.2s ease;

      &:focus {
        outline: none;
        box-shadow: 0px 0px 5px rgba(78, 115, 223, 0.5);
        transform: scale(1.02);
      }
    }
  }

  button {
    width: 100%;
    padding: 15px; /* Larger button size */
    background: linear-gradient(135deg, #6c63ff, #4a4e69);
    color: white;
    font-size: 1.3rem; /* Larger button text */
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #4a4e69, #6c63ff);
      transform: translateY(-2px);
      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
`;

const SuccessMessage = styled.div`
  color: #2e7d32;
  font-size: 1.1rem; /* Slightly larger success message */
  text-align: center;
  margin-bottom: 15px;
  background: #e8f5e9;
  padding: 15px; /* More padding for larger form */
  border-radius: 8px;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: #c62828;
  font-size: 1.1rem; /* Slightly larger error message */
  text-align: center;
  margin-bottom: 15px;
  background: #ffebee;
  padding: 15px; /* More padding for larger form */
  border-radius: 8px;
  box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
`;



export default CreateManager;
