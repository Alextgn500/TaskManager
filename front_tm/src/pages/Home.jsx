import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Добро пожаловать в TaskManager!</h1>
        <p className="hero-subtitle">
          Управляйте своими задачами эффективно и просто
        </p>

        <div className="home-actions">
          <Link to="/about" className="btn btn-primary">
            О нас
          </Link>
          <Link to="/pages/auth/login" className="btn btn-secondary">
            Вход
          </Link>
          <Link to="/pages/auth/register" className="btn btn-outline">
            Регистрация
          </Link>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2025 TaskManager. Создано для повышения продуктивности</p>
      </footer>
    </div>
  );
};

export default Home;
