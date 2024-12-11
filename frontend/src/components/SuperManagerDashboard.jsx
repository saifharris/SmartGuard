import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import styled from "styled-components"; // Import styled-components

// Styled Components
const Dashboard = styled.div`
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(145deg, #120428, #2b103d);
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
`;

const Navbar = styled.nav`
  background: #1f0933;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  border-radius: 10px;

  h2 {
    color: #d368f5;
    font-size: 24px;
    margin: 0;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 15px;
    margin: 0;

    li {
      display: inline-block;

      a {
        text-decoration: none;
        color: #ffffff;
        font-size: 16px;
        padding: 8px 15px;
        border-radius: 5px;
        transition: background 0.3s ease, color 0.3s ease;

        &:hover {
          background: #d368f5;
          color: #1f0933;
        }
      }
    }
  }
`;

const Section = styled.div`
  margin-top: 30px;

  h3 {
    color: #d368f5;
    font-size: 20px;
    margin-bottom: 15px;
  }

  form {
    background: linear-gradient(145deg, #2b103d, #3d1450);
    border-radius: 10px;
    padding: 20px 30px;
    width: 400px;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
    text-align: left;

    div {
      margin-bottom: 15px;

      label {
        display: block;
        color: #ffffff;
        font-size: 14px;
        margin-bottom: 5px;
      }

      input {
        width: 94%;
        padding: 10px;
        border: 2px solid #9f24c2;
        border-radius: 5px;
        background: #1f0933;
        color: #ffffff;
        font-size: 14px;
        transition: border-color 0.3s ease, background-color 0.3s ease;

        &:focus {
          outline: none;
          border-color: #d368f5;
          background-color: #3d1450;
        }
      }
    }

    button {
      width: 100%;
      padding: 12px;
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
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      background: linear-gradient(145deg, #1f0933, #2b103d);
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 10px;
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.6);
      }

      h4 {
        color: #d368f5;
        font-size: 18px;
        margin-bottom: 10px;
      }

      p {
        color: #ffffff;
      }
    }
  }
`;

const PlayerWrapper = styled.div`
  margin-top: 10px;
  iframe {
    border-radius: 10px;
  }
`;


const SuperManagerDashboard = () => {
  const [managers, setManagers] = useState([]); // List of managers
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    videos: [], // Store multiple videos
  }); // Data for creating a manager
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchManagersWithVideos = async () => {
      try {
        const parentId = localStorage.getItem("userId"); // Get supermanager ID from localStorage
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
        if (!parentId) {
          console.error("Missing supermanager ID");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/auth/videos/managers/${parentId}`
        );
        setManagers(res.data); // Set the fetched managers
      } catch (error) {
        console.error("Error fetching managers:", error);
        alert("Failed to fetch managers. Please try again.");
      }
    };

    fetchManagersWithVideos();
  }, []);

  const handleCreateManager = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("parentId", localStorage.getItem("userId")); // Include supermanager ID
      formData.videos.forEach((video) => {
        formDataToSend.append("videos", video); // Attach multiple videos
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/create-manager",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Manager created successfully!");
      setManagers((prevManagers) => [...prevManagers, res.data.user]); // Add the new manager to the list
      setFormData({ username: "", password: "", videos: [] }); // Reset the form
    } catch (error) {
      console.error("Error creating manager:", error.response.data.error);
      alert(error.response.data.error || "Failed to create manager. Please try again.");
    }
  };

  return (
    <Dashboard>
      <Navbar>
        <h2>Supermanager : {username}</h2>
        <ul>
          <li>
            <a href="#create-manager">Create Manager</a>
          </li>
          <li>
            <a href="#managers-list">Managers List</a>
          </li>
          <li>
            <a href="/">Logout</a>
          </li>
        </ul>
      </Navbar>

      <Section id="create-manager">
        <h3>Create Manager</h3>
        <form onSubmit={handleCreateManager}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter manager username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter manager password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Upload Videos (Max 2):</label>
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
        </form>
      </Section>

      <Section id="managers-list">
        <h3>Managers List</h3>
        <ul>
          {managers.length === 0 ? (
            <p>No managers created yet.</p>
          ) : (
            managers.map((manager) => (
              <li key={manager._id}>
                <h4>{manager.username}</h4>
                {manager.videoUrls && manager.videoUrls.length > 0 ? (
                  manager.videoUrls.map((url, index) => (
                    <PlayerWrapper key={index}>
                      <ReactPlayer url={`http://localhost:5000${url}`} controls />
                    </PlayerWrapper>
                  ))
                ) : (
                  <p>No videos uploaded</p>
                )}
              </li>
            ))
          )}
        </ul>
      </Section>
    </Dashboard>
  );
};

export default SuperManagerDashboard;
