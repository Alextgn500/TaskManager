import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUserData } from "../services/api";
import "./ProfilePage.css";

const ProfilePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    age: "",
  });

  const userId = localStorage.getItem("userId");
  const userPassword = localStorage.getItem("userPassword");

  // ✅ ДОБАВЛЯЕМ ТОЛЬКО ЭТУ ФУНКЦИЮ для навигации к задачам
  const handleTasksClick = () => {
    console.log("🚀 Переходим к задачам пользователя:", userId);
    navigate("/tasks");
  };

  // ✅ Диагностическая функция для проверки localStorage
  const checkLocalStorage = useCallback(() => {
    console.log("🔍 === ДИАГНОСТИКА localStorage ===");
    console.log("userId:", userId);
    console.log("userPassword exists:", !!userPassword);
    console.log("userPassword length:", userPassword ? userPassword.length : 0);
    console.log("All localStorage keys:", Object.keys(localStorage));

    const allStorage = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allStorage[key] = localStorage.getItem(key);
    }
    console.log("All localStorage data:", allStorage);
    console.log("=================================");
  }, [userId, userPassword]);

  // ✅ Функция тестирования API подключения
  const testApiConnection = useCallback(async () => {
    console.log("🧪 === ТЕСТ API ПОДКЛЮЧЕНИЯ ===");

    try {
      console.log("🌐 Тестируем основной URL...");
      const response = await fetch("http://localhost:8000", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Статус ответа:", response.status);
      console.log("📡 Статус OK:", response.ok);

      if (response.ok) {
        console.log("✅ Основной API доступен");

        // Тестируем docs endpoint
        try {
          const docsResponse = await fetch("http://localhost:8000/docs");
          console.log("📚 Docs endpoint статус:", docsResponse.status);
          console.log("📚 Docs endpoint OK:", docsResponse.ok);
        } catch (docsError) {
          console.log("❌ Docs endpoint недоступен:", docsError);
        }

        return true;
      } else {
        console.log("❌ API отвечает с ошибкой:", response.status);
        return false;
      }
    } catch (error) {
      console.log("❌ API недоступен:", error);
      console.log("❌ Тип ошибки:", error.name);
      console.log("❌ Сообщение:", error.message);
      return false;
    }
  }, []);

  // ✅ Функция тестирования конкретного пользователя
  const testUserEndpoint = useCallback(async () => {
    if (!userId) {
      console.log("❌ userId отсутствует для тестирования");
      return false;
    }

    console.log("🧪 === ТЕСТ ПОЛЬЗОВАТЕЛЯ ===");
    const url = `http://localhost:8000/users/${userId}`;
    console.log("🌐 Тестируем URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Статус ответа:", response.status);
      console.log("📡 Headers:", [...response.headers.entries()]);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Данные пользователя:", data);
        return data;
      } else {
        let errorText = "";
        try {
          const errorData = await response.text();
          console.log("❌ Текст ошибки:", errorData);
          errorText = errorData;
        } catch (textError) {
          console.log("❌ Не удалось получить текст ошибки:", textError);
        }

        console.log("❌ Ошибка пользователя:", response.status, errorText);
        return false;
      }
    } catch (error) {
      console.log("❌ Ошибка запроса пользователя:", error);
      return false;
    }
  }, [userId]);

  // ✅ Основная функция загрузки профиля с диагностикой
  const loadUserProfile = useCallback(async () => {
    console.log("🔍 === НАЧАЛО ЗАГРУЗКИ ПРОФИЛЯ ===");

    // Проверяем localStorage
    checkLocalStorage();

    if (!userId) {
      console.log("❌ userId отсутствует, перенаправляем на логин");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("📡 Отправляем запрос к API...");
      console.log("🌐 URL:", `http://localhost:8000/users/${userId}`);

      const userData = await getUserData(userId);
      console.log("✅ Данные успешно получены:", userData);

      setUser(userData);
      setEditData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        age: userData.age || "",
      });

      console.log("✅ Состояние обновлено успешно");
    } catch (error) {
      console.log("❌ === ОШИБКА ЗАГРУЗКИ ПРОФИЛЯ ===");
      console.log("❌ Полная ошибка:", error);
      console.log("❌ Тип ошибки:", error.name);
      console.log("❌ Сообщение ошибки:", error.message);
      console.log("❌ Стек ошибки:", error.stack);

      // Детальная диагностика ошибки
      let errorMessage = "Неизвестная ошибка";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Не удается подключиться к серверу. Проверьте, что бэкенд запущен на http://localhost:8000";
      } else if (error.message.includes("404")) {
        errorMessage = `Пользователь с ID ${userId} не найден. Возможно, нужно заново войти в систему.`;
      } else if (error.message.includes("500")) {
        errorMessage = "Внутренняя ошибка сервера. Проверьте логи бэкенда.";
      } else {
        errorMessage = "Ошибка загрузки профиля: " + error.message;
      }

      setError(errorMessage);
      console.log("❌ Установлена ошибка:", errorMessage);
    } finally {
      setLoading(false);
      console.log("🔍 === КОНЕЦ ЗАГРУЗКИ ПРОФИЛЯ ===");
    }
  }, [userId, navigate, checkLocalStorage]);

  // ✅ useEffect с диагностикой
  useEffect(() => {
    console.log("🔄 === useEffect TRIGGERED ===");
    console.log("🔄 userId:", userId);
    console.log("🔄 Component mounted, loading profile...");

    loadUserProfile();

    return () => {
      console.log("🧹 === ProfilePage CLEANUP ===");
    };
  }, [loadUserProfile, userId]);

  // ✅ Обработчики событий с диагностикой
  const handleGoToTasks = useCallback(() => {
    console.log("🔄 Переход к задачам пользователя:", userId);
    navigate("/tasks");
  }, [navigate, userId]);

  const handleGoToStats = useCallback(() => {
    console.log("🔄 Переход к статистике пользователя:", userId);
    navigate("/tasks?tab=stats");
  }, [navigate, userId]);

  const handleStartEdit = useCallback(() => {
    console.log("✏️ Начало редактирования профиля");
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    console.log("❌ Отмена редактирования");
    setIsEditing(false);
    setEditData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      age: user?.age?.toString() || "",
    });
  }, [user]);

  const handleSaveProfile = useCallback(async () => {
    console.log("💾 === НАЧАЛО СОХРАНЕНИЯ ПРОФИЛЯ ===");

    // Проверка userId
    if (!userId) {
      console.log("❌ userId отсутствует");
      alert("❌ Ошибка: не найден ID пользователя");
      return;
    }

    // Детальная диагностика текущих данных
    console.log("🔍 userId:", userId);
    console.log("🔍 Исходный user:", user);
    console.log("🔍 Текущий editData:", editData);
    console.log("🔍 Ключи editData:", Object.keys(editData));
    console.log("🔍 Значения editData:", Object.values(editData));

    try {
      // ✅ Создаем абсолютно чистый payload только с необходимыми полями
      const payload = {};

      // Обработка firstname
      if (editData.firstname !== undefined) {
        payload.firstname = String(editData.firstname || "").trim();
      }

      // Обработка lastname
      if (editData.lastname !== undefined) {
        payload.lastname = String(editData.lastname || "").trim();
      }

      // Обработка age
      if (editData.age !== undefined && editData.age !== "") {
        const ageValue = String(editData.age).trim();
        if (ageValue && !isNaN(ageValue)) {
          payload.age = parseInt(ageValue, 10);
        } else {
          payload.age = null;
        }
      } else {
        payload.age = null;
      }

      console.log("📤 Финальный payload:");
      console.log("📤 Содержимое:", payload);
      console.log("📤 Ключи:", Object.keys(payload));
      console.log("📤 JSON строка:", JSON.stringify(payload, null, 2));

      // Отправка данных на сервер
      console.log("🌐 Отправляем запрос на сервер...");
      const updatedUserResponse = await updateUserData(userId, payload);
      console.log("✅ Ответ сервера:", updatedUserResponse);

      // Получаем свежие данные с сервера для синхронизации
      console.log("🔄 Получаем обновленные данные с сервера...");
      const freshUserData = updatedUserResponse || (await getUserData(userId));
      console.log("📥 Свежие данные:", freshUserData);

      // Обновляем состояние компонента
      setUser(freshUserData);

      // ✅ Синхронизируем editData с полученными данными
      const newEditData = {
        firstname: freshUserData.firstname || "",
        lastname: freshUserData.lastname || "",
        age: freshUserData.age != null ? String(freshUserData.age) : "",
      };

      console.log("🔄 Обновляем editData на:", newEditData);
      setEditData(newEditData);

      // Выходим из режима редактирования
      setIsEditing(false);

      console.log("✅ === ПРОФИЛЬ УСПЕШНО СОХРАНЕН ===");
      alert("✅ Профиль успешно обновлен!");
    } catch (error) {
      console.error("❌ === ОШИБКА СОХРАНЕНИЯ ПРОФИЛЯ ===");
      console.error("❌ Тип ошибки:", error.name);
      console.error("❌ Сообщение:", error.message);
      console.error("❌ Полная ошибка:", error);

      let errorMessage = "Неизвестная ошибка при сохранении профиля";

      if (error.message.includes("400")) {
        errorMessage =
          "❌ Неверные данные. Проверьте правильность заполнения полей.";
      } else if (error.message.includes("404")) {
        errorMessage =
          "❌ Пользователь не найден. Попробуйте войти в систему заново.";
      } else if (error.message.includes("500")) {
        errorMessage = "❌ Ошибка сервера. Попробуйте позже.";
      } else if (error.name === "TypeError") {
        errorMessage = "❌ Проблема с подключением к серверу.";
      } else {
        errorMessage = `❌ Ошибка: ${error.message}`;
      }

      alert(errorMessage);
      console.log("❌ Показана ошибка пользователю:", errorMessage);
    }
  }, [userId, editData, user]);


  const handleLogout = useCallback(() => {
    console.log("🚪 === ВЫХОД ИЗ СИСТЕМЫ ===");
    console.log("🚪 Текущий userId:", userId);
    console.log("🚪 Очищаем localStorage...");

    localStorage.removeItem("userId");
    localStorage.removeItem("userPassword");

    console.log("🚪 localStorage очищен");
    console.log("🚪 После очистки userId:", localStorage.getItem("userId"));

    if (onLogout) {
      console.log("🚪 Вызываем onLogout callback");
      onLogout();
    }

    console.log("🚪 Перенаправляем на /login");
    navigate("/login", { replace: true });
  }, [onLogout, navigate, userId]);

  const handleInputChange = useCallback((field, value) => {
    console.log(`📝 Изменение поля ${field}:`, value);
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // ✅ Кнопка полной диагностики
  const runFullDiagnostics = useCallback(async () => {
    console.log("🔍 === ПОЛНАЯ ДИАГНОСТИКА ===");

    checkLocalStorage();

    console.log("🧪 Тестируем API...");
    const apiOk = await testApiConnection();

    if (apiOk) {
      console.log("🧪 Тестируем пользователя...");
      const userData = await testUserEndpoint();

      if (userData) {
        console.log("✅ Все тесты пройдены! Данные пользователя получены.");
        alert(
          "✅ Диагностика пройдена успешно! Проверьте консоль для деталей."
        );
      } else {
        console.log("❌ Тест пользователя не прошел");
        alert("❌ Пользователь не найден. Попробуйте заново войти в систему.");
      }
    } else {
      console.log("❌ API недоступен");
      alert("❌ Сервер недоступен. Запустите бэкенд на порту 8000.");
    }

    console.log("🔍 === КОНЕЦ ДИАГНОСТИКИ ===");
  }, [checkLocalStorage, testApiConnection, testUserEndpoint]);

  // ✅ Состояние загрузки
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка профиля...</p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            Проверьте консоль для диагностики
          </p>
        </div>
      </div>
    );
  }

  // ✅ Состояние ошибки с диагностикой
  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <p>{error}</p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <button onClick={loadUserProfile} className="retry-button">
              🔄 Попробовать снова
            </button>
            <button onClick={runFullDiagnostics} className="retry-button">
              🔍 Полная диагностика
            </button>
            <button onClick={testApiConnection} className="retry-button">
              🧪 Тест API
            </button>
            <button onClick={testUserEndpoint} className="retry-button">
              👤 Тест пользователя
            </button>
            <button onClick={handleLogout} className="retry-button">
              🚪 Выйти
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
            Откройте консоль браузера (F12) для подробной диагностики
          </p>
        </div>
      </div>
    );
  }

  // ✅ Состояние отсутствия пользователя
  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <p>Данные пользователя не найдены</p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <button onClick={loadUserProfile} className="retry-button">
              🔄 Перезагрузить
            </button>
            <button onClick={runFullDiagnostics} className="retry-button">
              🔍 Диагностика
            </button>
            <button onClick={handleLogout} className="retry-button">
              🚪 Выйти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Основной интерфейс
  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Панель диагностики (временная) */}
        <div
          style={{
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "12px",
          }}
        >
          <strong>🔍 Диагностическая панель:</strong>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={checkLocalStorage}
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              💾 Проверить localStorage
            </button>
            <button
              onClick={testApiConnection}
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              🌐 Тест API
            </button>
            <button
              onClick={testUserEndpoint}
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              👤 Тест пользователя
            </button>
            <button
              onClick={runFullDiagnostics}
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              🔍 Полная диагностика
            </button>
          </div>
        </div>

        {/* Заголовок профиля */}
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h1>Мой профиль</h1>
          <p className="profile-greeting">
            Привет, {user.firstname || user.username || "Пользователь"}! 👋
          </p>
        </div>

        {/* Быстрые действия */}
        <div className="quick-actions">
          <h3>📋 Быстрые действия</h3>
          <div className="action-buttons">
            <button
              className="action-button tasks-button"
              onClick={handleGoToTasks}
              type="button"
            >
              <span className="button-icon">📝</span>
              <div className="button-content">
                <span className="button-title" onClick={handleTasksClick}>
                  Мои задачи
                </span>
                <span className="button-subtitle">
                  Управление задачами и проектами
                </span>
              </div>
              <span className="button-arrow">→</span>
            </button>

            <button
              className="action-button stats-button"
              onClick={handleGoToStats}
              type="button"
            >
              <span className="button-icon">📊</span>
              <div className="button-content">
                <span className="button-title">Статистика</span>
                <span className="button-subtitle">Прогресс и аналитика</span>
              </div>
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Информация профиля */}
        <div className="profile-info">
          <h3>ℹ️ Информация профиля</h3>

          {!isEditing ? (
            <div className="profile-details">
              <div className="profile-field">
                <label>🆔 ID:</label>
                <span>{user.id || "Не указано"}</span>
              </div>
              <div className="profile-field">
                <label>👤 Имя пользователя:</label>
                <span>{user.username || "Не указано"}</span>
              </div>
              <div className="profile-field">
                <label>🎭 Имя:</label>
                <span>{user.firstname || "Не указано"}</span>
              </div>
              <div className="profile-field">
                <label>👨‍👩‍👧‍👦 Фамилия:</label>
                <span>{user.lastname || "Не указано"}</span>
              </div>
              <div className="profile-field">
                <label>🎂 Возраст:</label>
                <span>{user.age ? `${user.age} лет` : "Не указано"}</span>
              </div>
              <div className="profile-field">
                <label>🔗 Слаг:</label>
                <span>{user.slug || "Не указано"}</span>
              </div>

              <button
                className="edit-button"
                onClick={handleStartEdit}
                type="button"
              >
                ✏️ Редактировать профиль
              </button>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="edit-note">
                <p>📝 Вы можете изменить имя, фамилию и возраст</p>
              </div>

              <div className="edit-field">
                <label>🎭 Имя:</label>
                <input
                  type="text"
                  value={editData.firstname}
                  onChange={(e) =>
                    handleInputChange("firstname", e.target.value)
                  }
                  placeholder="Введите ваше имя"
                />
              </div>

              <div className="edit-field">
                <label>👨‍👩‍👧‍👦 Фамилия:</label>
                <input
                  type="text"
                  value={editData.lastname}
                  onChange={(e) =>
                    handleInputChange("lastname", e.target.value)
                  }
                  placeholder="Введите вашу фамилию"
                />
              </div>

              <div className="edit-field">
                <label>🎂 Возраст:</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={editData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Введите ваш возраст"
                />
              </div>

              <div className="edit-buttons">
                <button
                  className="cancel-button"
                  onClick={handleCancelEdit}
                  type="button"
                >
                  ❌ Отмена
                </button>
                <button
                  className="save-button"
                  onClick={handleSaveProfile}
                  type="button"
                >
                  💾 Сохранить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка выхода */}
        <div className="profile-actions">
          <button
            className="logout-button"
            onClick={handleLogout}
            type="button"
          >
            🚪 Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
