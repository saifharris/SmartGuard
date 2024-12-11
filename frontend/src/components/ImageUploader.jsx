import React, { useState } from "react";
import axios from "axios";
import "./ImageUploader.css"; // Import the CSS file

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [personName, setPersonName] = useState("");
  const [loading, setLoading] = useState(false); // State to track if scripts are running
  const [currentScript, setCurrentScript] = useState(""); // State to track the name of the running script

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleNameChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("person_name", personName);

    setLoading(true); // Start loading
    setCurrentScript("Augmentation->Training->Detection"); // Set script name to Augmentation

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
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };

  const handleExecuteMain = async () => {
    setLoading(true); // Start loading
    setCurrentScript("Recognizing from WatchList"); // Set script name to Real-time Recognition
    try {
      const response = await axios.get("http://localhost:5000/run-main");
      console.log(response.data);
    } catch (error) {
      console.error("Error executing main.py:", error);
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };

  return (
    <div className="uploader-container">
      {loading && (
        <div className="loaderClass">
          {" "}
          {/* Loader div */}
          <div className="simple-loader"></div>
          <p className="script-name">{currentScript} in progress...</p>{" "}
          {/* Display current script name */}
        </div>
      )}
      {!loading && (
        <>
          <form className="uploader-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="textfield"
              placeholder="Enter your name"
              value={personName}
              onChange={handleNameChange}
              required
            />
            <input
              type="file"
              className="file-input"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              required
            />
            <button type="submit" className="upload-button">
              Upload Images
            </button>
          </form>
          <div>
            <button className="main-button" onClick={handleExecuteMain}>
              Pre-Trained
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
