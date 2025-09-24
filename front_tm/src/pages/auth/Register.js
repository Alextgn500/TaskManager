import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    age: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          age: parseInt(formData.age),
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Пользователь создан:", result);
        alert("Регистрация успешна!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Ошибка ответа:", errorData);
        setError(errorData.detail || "Ошибка регистрации");
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Регистрация</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstname">Имя:</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Фамилия:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Возраст:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="login-link">
          Есть аккаунт?
          <span
            onClick={() => navigate("/login")}
            style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
          >
            Войти
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
