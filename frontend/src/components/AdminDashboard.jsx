import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

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

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleCreateSuperManager}>
        <input
          type="text"
          placeholder="SuperManager Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="SuperManager Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Create SuperManager</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
