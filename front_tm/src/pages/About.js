import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <header className="about-header">
          <h1>О TaskManager</h1>
          <p className="subtitle">
            Ваш надежный помощник в управлении задачами
          </p>
        </header>

        <section className="about-section">
          <h2>Что это такое?</h2>
          <p>
            TaskManager — это современное веб-приложение для управления личными
            задачами. Мы помогаем вам организовать свое время, отслеживать
            прогресс и достигать целей.
          </p>
        </section>

        <section className="about-section">
          <h2>Возможности</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Создание задач</h3>
              <p>Легко добавляйте новые задачи с описанием и приоритетом</p>
            </div>

            <div className="feature-card">
              <h3>Отслеживание статуса</h3>
              <p>Три статуса: Ожидает → В работе → Завершена</p>
            </div>

            <div className="feature-card">
              <h3>Приоритеты</h3>
              <p>Устанавливайте приоритеты: Низкий, Средний, Высокий</p>
            </div>

            <div className="feature-card">
              <h3>Личный кабинет</h3>
              <p>Управляйте своим профилем и настройками</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Технологии</h2>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">PostgreSQL</span>
            <span className="tech-badge">CSS3</span>
            <span className="tech-badge">JavaScript</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">Docker</span>
          </div>
        </section>

        <section className="about-section">
          <h2>Начать работу</h2>
          <p>
            Готовы повысить свою продуктивность? Зарегистрируйтесь прямо сейчас
            и начните эффективно управлять своими задачами!
          </p>

          <div className="cta-buttons">
            <Link to="/" className="cta-button primary">
              Главная
            </Link>
            <Link to="/pages/auth/login" className="cta-button secondary">
              Вход
            </Link>
            <Link to="/pages/auth/register" className="cta-button outline">
              Регистрация
            </Link>
          </div>
        </section>

        <footer className="about-footer">
          <p>&copy; 2025 TaskManager. Создано для повышения продуктивности</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
