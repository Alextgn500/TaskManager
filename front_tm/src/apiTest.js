const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

class ApiTest {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Тест соединения с API
  async testConnection() {
    try {
      const response = await this.request("/");
      return { status: "ok", data: response };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  // Аутентификация
  async login(username, password) {
    try {
      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      const response = await this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Задачи
  async getTasks(token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await this.request("/tasks/", {
        method: "GET",
        headers,
      });
      return response;
    } catch (error) {
      throw new Error(`Get tasks failed: ${error.message}`);
    }
  }

  async createTask(taskData, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await this.request("/tasks/", {
        method: "POST",
        headers,
        body: JSON.stringify(taskData),
      });
      return response;
    } catch (error) {
      throw new Error(`Create task failed: ${error.message}`);
    }
  }

  async updateTask(taskId, taskData, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await this.request(`/tasks/${taskId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(taskData),
      });
      return response;
    } catch (error) {
      throw new Error(`Update task failed: ${error.message}`);
    }
  }

  async deleteTask(taskId, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await this.request(`/tasks/${taskId}`, {
        method: "DELETE",
        headers,
      });
      return response;
    } catch (error) {
      throw new Error(`Delete task failed: ${error.message}`);
    }
  }
}

// Создаем и экспортируем экземпляр
const apiTest = new ApiTest();

export default apiTest;

// Экспортируем отдельные методы для удобства
export const {
  testConnection,
  login,
  register,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = apiTest;
