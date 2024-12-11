import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SuperManagerDashboard from "./components/SuperManagerDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import VideoPage from "./components/VideoPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AdminPanel from "./components/AdminPanel";
import SuperManager from "./components/SuperManager"
import SuperManagerVideoPage from "./components/supermanagerutils/SuperManagerVideoPage"
import AnalyticsView from "./components/supermanagerutils/AnalyticsView";
import Logs from "./components/supermanagerutils/Logs";
import Dashboard from "./components/managerutils/Dashboard";

import SearchByImagePage from "./components/managerutils/SearchPage";

import ImageUploader from "./components/ImageUploader.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/supermanager" element={<SuperManager />} />
          <Route path="/manager" element={<Dashboard />} />
          <Route path="/videos" element={<SuperManagerVideoPage />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          {/* <Route path="/logs" element={<Logs />} /> */}
          <Route path="/video" element={<VideoPage />} />
          {/* <Route path="/Search_by_image" element={<SearchByImagePage />} /> */}
          {/* <Route path="/facial_recognition" element={<ImageUploader />} /> */}
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
