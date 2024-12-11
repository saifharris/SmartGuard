import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  min-height: 100vh;
  width: 100%;
  color: #1a1a2e;
  padding: 2rem;
  box-sizing: border-box;
`;

const UploaderWrapper = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const UploaderTitle = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #1a1a2e;
  font-size: 1.8rem;
`;

const UploaderForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextField = styled.input`
  width: 100%;
  padding: 5px;
  margin-right: 5px;
  border-radius: 8px;
  border: 2px solid #b561d2;
  background-color: #f9f9f9;
  color: #1a1a2e;
  font-size: 16px;

  &::placeholder {
    color: #9f9f9f;
  }

  &:focus {
    outline: none;
    border-color: #9f24c2;
    background-color: #ffffff;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 5px;
  border-radius: 8px;
  border: 2px solid #b561d2;
  background-color: #f9f9f9;
  color: #1a1a2e;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #9f24c2;
    background-color: #ffffff;
  }
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: white;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #9f24c2; 
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MainButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(145deg, #9f24c2, #b561d2);
  color: white;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 2rem;

  &:hover {
    background-color: #9f24c2;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LoaderClass = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  color: white;
`;

const SimpleLoader = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #b561d2;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ScriptName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  color: white;
`;

const MainButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;

export default function ImageUploader() {
  const [files, setFiles] = useState([]);
  const [personName, setPersonName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentScript, setCurrentScript] = useState("");

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleNameChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!personName.trim() || files.length === 0) {
      alert("Please enter a name and select at least one image.");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("person_name", personName);

    setLoading(true);
    setCurrentScript("Augmentation -> Training -> Detection");

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      alert("Images uploaded successfully and process completed!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteMain = async () => {
    setLoading(true);
    setCurrentScript("Recognizing from WatchList");
    try {
      const response = await axios.get("http://localhost:5000/run-main");
      console.log(response.data);
      alert("Recognition process completed successfully!");
    } catch (error) {
      console.error("Error executing main.py:", error);
      alert("Error executing recognition. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploaderContainer>
      {loading && (
        <LoaderClass>
          <SimpleLoader />
          <ScriptName>{currentScript} in progress...</ScriptName>
        </LoaderClass>
      )}

      {!loading && (
        <UploaderWrapper>
          <UploaderTitle>Facial Recognition Training</UploaderTitle>
          <UploaderForm onSubmit={handleSubmit}>
            <TextField
              type="text"
              placeholder="Enter the person's name"
              value={personName}
              onChange={handleNameChange}
              required
            />
            <FileInput
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              required
            />
            <UploadButton type="submit">Upload & Process</UploadButton>
          </UploaderForm>
          <MainButtonWrapper>
            <MainButton onClick={handleExecuteMain}>Use Pre-Trained Model</MainButton>
          </MainButtonWrapper>
        </UploaderWrapper>
      )}
    </UploaderContainer>
  );
}
