const API_URL = "http://localhost:8000";

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

const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
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
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Ошибка обновления пользователя");
  }

  return response.json();
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
const createTask = async (taskData) => {
  console.log("📝 Создание задачи:", taskData);

  const response = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Ошибка создания задачи:", errorData);
    throw new Error(errorData.detail || "Ошибка создания задачи");
  }

  const newTask = await response.json();
  console.log("✅ Задача создана:", newTask);
  return newTask;
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
// Уберите этот блок:
export {
  loginUser,
  registerUser,
  getUserData, // ❌ Конфликт здесь
  updateUserData,
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
};
