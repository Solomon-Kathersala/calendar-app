import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate} from "react-router-dom";
import {Space} from "antd";
import AdminModule from "./components/AdminModule";
import UserModule from "./components/UserModule";
import "./App.css";

function App() {
  return (
    <Router basename="/calendar-app">
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  const [compNames, setCompNames] = useState([]);
  
  return (
    <div className="app-wrapper">
      <nav className="nav-links">
        <Space className="space">
          <Link
            to="/admin"
            className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
          >
            Admin
          </Link>
          <Link
            to="/user"
            className={`nav-link ${location.pathname === "/user" ? "active" : ""}`}
          >
            User
          </Link>
        </Space>
      </nav>
      <h1>Calendar Application for Communication Tracking</h1>

      <Routes>
        <Route path="/admin" element={<AdminModule setCompNames={setCompNames} />} />
        <Route path="/user" element={<UserModule compNames={compNames} />} />
        <Route path="/" element={<Navigate to="/admin" />} />
      </Routes>
    </div>
  );
};

export default App;
