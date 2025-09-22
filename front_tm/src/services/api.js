const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// ===== АУТЕНТИФИКАЦИЯ =====
const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Ошибка входа");
  }

  const data = await response.json();
  return data;
};

const registerUser = async (username, firstname, lastname, age, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      firstname,
      lastname,
      age,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Ошибка регистрации");
  }

  const data = await response.json();
  return data;
};

// ===== ПОЛЬЗОВАТЕЛИ =====
const getUserData = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Ошибка получения данных пользователя");
  }

  return response.json();
};

const updateUserData = async (userId, userData) => {
  try {
    console.log("🌐 URL запроса:", `${API_URL}/users/${userId}`);
    console.log("📤 Отправляемые данные:", JSON.stringify(userData, null, 2));

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("📥 Статус ответа:", response.status);
    console.log("📥 Headers ответа:", response.headers);

    // ✅ Получаем текст ответа для диагностики
    const responseText = await response.text();
    console.log("📥 Текст ответа:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.log("❌ Ошибка от сервера:", errorData);
      throw new Error(
        `Ошибка ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.log("❌ Полная ошибка:", error);
    throw error;
  }
};

// ===== ЗАДАЧИ =====

// Получить все задачи пользователя
const getUserTasks = async (userId) => {
  console.log("🔍 Запрос задач для пользователя:", userId);

  const response = await fetch(`${API_URL}/tasks/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Ошибка получения задач:", errorData);
    throw new Error(errorData.detail || "Ошибка получения задач");
  }

  const tasks = await response.json();
  console.log("✅ Задачи получены:", tasks);
  return tasks;
};

// Создать новую задачу
const createTask = async (taskData, userId) => {
  console.log("📝 Создание задачи:", taskData);
  console.log("👤 ID пользователя:", userId, "Тип:", typeof userId);

  try {
    const requestBody = {
      title: taskData.title || "",
      content: taskData.content || "",
      priority: taskData.priority ?? 1,
      completed: false,
      user_id: parseInt(userId, 10), // ИСПРАВЛЕНО: преобразуем в число
    };

    console.log("📦 Отправляемые данные:", requestBody);
    console.log(
      "🔢 user_id после преобразования:",
      requestBody.user_id,
      "Тип:",
      typeof requestBody.user_id
    );

    const response = await fetch("http://localhost:8000/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Статус ответа:", response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error("❌ Детали ошибки сервера:", errorData);
      } catch (parseError) {
        console.error("❌ Не удалось парсить ошибку:", parseError);
        errorData = {
          detail: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail
            .map((err) => `${err.loc?.join(".")}: ${err.msg}`)
            .join("; ")
        : errorData.detail ||
          `Ошибка ${response.status}: ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const newTask = await response.json();
    console.log("✅ Задача успешно создана:", newTask);
    return newTask;
  } catch (error) {
    console.error("💥 Ошибка при создании задачи:", error);
    throw error;
  }
};

// Обновить задачу
const updateTask = async (taskId, taskData) => {
  console.log("📝 Обновление задачи:", taskId, taskData);

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Ошибка обновления задачи:", errorData);
    throw new Error(errorData.detail || "Ошибка обновления задачи");
  }

  const updatedTask = await response.json();
  console.log("✅ Задача обновлена:", updatedTask);
  return updatedTask;
};

// Переключить статус задачи
const toggleTaskStatus = async (taskId, currentStatus) => {
  const newStatus = !currentStatus;
  return updateTask(taskId, { completed: newStatus });
};

// ✅ ДОБАВЛЕНА ФУНКЦИЯ УДАЛЕНИЯ ЗАДАЧИ
const deleteTask = async (taskId) => {
  console.log("🗑 Удаление задачи:", taskId);

  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Ошибка удаления задачи:", errorData);
    throw new Error(errorData.detail || "Ошибка удаления задачи");
  }

  console.log("✅ Задача удалена:", taskId);
  return { success: true, taskId };
};

// ✅ ЭКСПОРТ ВСЕХ ФУНКЦИЙ
export {
  loginUser,
  registerUser,
  getUserData,
  updateUserData,
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};
