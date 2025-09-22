import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProfilePage from "./pages/ProfilePage";
import TasksPage from "./pages/TasksPage";
import "./App.css";

// Компонент с логикой приложения (без Router)
export function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("userId");
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <div className="App" data-testid="app-container">
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Авторизация */}
        <Route
          path="/pages/auth/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/profile" replace />
            )
          }
        />
        <Route
          path="/pages/auth/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/profile" replace />
          }
        />

        {/* Совместимость */}
        <Route
          path="/login"
          element={<Navigate to="/pages/auth/login" replace />}
        />
        <Route
          path="/register"
          element={<Navigate to="/pages/auth/register" replace />}
        />

        {/* Защищённые маршруты */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/pages/auth/login" replace />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
              <TasksPage />
            ) : (
              <Navigate to="/pages/auth/login" replace />
            )
          }
        />

        {/* 404 → главная */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Основной App без Router — Router уже в index.js
export default function App() {
  return <AppContent />;
}
