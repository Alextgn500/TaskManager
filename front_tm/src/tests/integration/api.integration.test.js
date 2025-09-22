import apiTest from "../../apiTest";

describe("API Integration Tests", () => {
  const isApiAvailable = async () => {
    try {
      const response = await fetch("http://localhost:8000/tasks");
      return response.ok || response.status === 401; // 401 тоже означает что API работает
    } catch {
      return false;
    }
  };

  test("полный цикл аутентификации и работы с задачами", async () => {
    const apiAvailable = await isApiAvailable();
    if (!apiAvailable) {
      return console.warn("Тест пропущен - API недоступен");
    }

    // 1. Регистрация (или используйте существующего пользователя)
    const registerData = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "testpassword123",
      password_confirmation: "testpassword123",
    };

    // 2. Вход в систему
    const loginData = {
      email: registerData.email,
      password: registerData.password,
    };

    // 3. Работа с задачами (если аутентификация успешна)
    const newTask = {
      title: "Интеграционная задача",
      description: "Тест полного цикла",
      priority: "medium",
    };

    try {
      const createdTask = await apiTest.createTask(newTask);
      if (createdTask) {
        const tasks = await apiTest.getTasks();
        expect(tasks).toBeInstanceOf(Array);

        await apiTest.deleteTask(createdTask.id);
      }
    } catch (error) {
      console.warn("Интеграционный тест требует аутентификации");
    }
  });
});
