import { useState } from "react";
// ❌ УДАЛЯЕМ: import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ❌ УДАЛЯЕМ: const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log(
      "API URL:",
      process.env.REACT_APP_API_URL || "http://localhost:8000"
    );

    if (!username || !password) {
      setError("Введите логин и пароль");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log("Ответ сервера:", data);

      if (response.ok) {
        console.log("✅ Успешный вход!");

        // ✅ Сохраняем данные пользователя в localStorage
        localStorage.setItem("userId", data.user_id || data.id || username);
        localStorage.setItem("username", data.username || username);
        localStorage.setItem("userPassword", password);

        // ✅ Вызываем onLogin БЕЗ ПАРАМЕТРОВ
        onLogin(); // App.js сам перенаправит на /profile

        // ❌ УДАЛИЛИ: navigate("/dashboard");
      } else {
        setError(data.detail || data.message || "Ошибка входа");
      }
    } catch (error) {
      console.error("Ошибка соединения:", error);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <h2>Вход в систему</h2>

        {error && (
          <div
            style={{
              color: "red",
              backgroundColor: "#fee",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label>Username:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#3b86d6ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

export default Login;
