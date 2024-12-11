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

      await axios.post(
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
      <CardAccent />
      <FormTitle>Create Manager</FormTitle>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <FormGroup>
        <Label>Username</Label>
        <Input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Password</Label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Upload Videos (Max 2)</Label>
        <Input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) =>
            setFormData({ ...formData, videos: [...e.target.files] })
          }
        />
      </FormGroup>

      <SubmitButton type="submit">Create Manager</SubmitButton>
    </Form>
  );
};

const Form = styled.form`
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  position: relative;
  font-family: Arial, sans-serif;
`;

const CardAccent = styled.div`
  box-sizing: border-box;
  content: "";
  display: block;
  width: 60px;
  height: 5px;
  background: #9f24c2;
  border-radius: 5px;
  margin: 0 auto 1.5rem auto;
`;

const FormTitle = styled.h3`
  box-sizing: border-box;
  font-size: 1.8rem;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  box-sizing: border-box;
  color: #2e7d32;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  background: #e8f5e9;
  padding: 0.75rem;
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  box-sizing: border-box;
  color: #c62828;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  background: #ffebee;
  padding: 0.75rem;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  box-sizing: border-box;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  box-sizing: border-box;
  font-size: 1rem;
  color: #1a1a2e;
  font-weight: bold;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #b561d2;
  border-radius: 8px;
  background: #ffffff;
  font-size: 1rem;
  color: #1a1a2e;
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #9f24c2;
    background-color: #f9f9ff;
  }
`;

const SubmitButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #9f24c2;
    box-shadow: 0px 8px 20px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export default CreateManager;
