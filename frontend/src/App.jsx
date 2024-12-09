import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import SuperManagerDashboard from "./components/SuperManagerDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import VideoPage from "./components/VideoPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/supermanager" element={<SuperManagerDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/video" element={<VideoPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
