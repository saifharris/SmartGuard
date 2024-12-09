import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
    </form>
  );
};

export default Login;
