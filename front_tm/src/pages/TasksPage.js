import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserTasks,
  createTask,
  deleteTask,
  toggleTaskStatus,
  // ❌ УДАЛЯЕМ updateTask - функции нет
} from "../services/api";
import "./TasksPage.css";

const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ✅ Правильные поля для новой задачи
  const [newTask, setNewTask] = useState({
    title: "",
    content: "", // ← content вместо description
    priority: 1, // ← int вместо строки (1=низкий, 2=средний, 3=высокий)
  });

  const userId = localStorage.getItem("userId");

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Загружаем задачи для пользователя:", userId);

      const userTasks = await getUserTasks(userId);
      setTasks(userTasks);
      console.log("✅ Задачи загружены:", userTasks);
    } catch (error) {
      console.error("❌ Ошибка загрузки задач:", error);
      setError("Ошибка загрузки задач: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    loadTasks();
  }, [userId, navigate, loadTasks]);

  // ✅ Фильтрация с правильными полями
  useEffect(() => {
    let filtered = tasks;

    if (filter === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (filter === "pending") {
      filtered = filtered.filter((task) => !task.completed);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.content &&
            task.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filter, searchTerm]);

  // ✅ Создание задачи с правильными полями
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert("Введите название задачи");
      return;
    }

    // Добавьте проверку userId
    if (!userId) {
      alert("Ошибка: не определен ID пользователя");
      return;
    }

    console.log("🆔 userId перед отправкой:", userId, "Тип:", typeof userId);

    try {
      const createdTask = await createTask(newTask, userId);
      setTasks([createdTask, ...tasks]);
      setNewTask({ title: "", content: "", priority: 1 });
      setShowCreateForm(false);
      console.log("✅ Задача создана:", createdTask);
    } catch (error) {
      console.error("❌ Ошибка создания задачи:", error);
      alert("Ошибка создания задачи: " + error.message);
    }
  };

  // ✅ Изменение статуса с использованием updatedTask
  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      const updatedTask = await toggleTaskStatus(taskId, !currentStatus);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      console.log("✅ Статус задачи изменен:", updatedTask);
    } catch (error) {
      console.error("❌ Ошибка изменения статуса:", error);
      alert("Ошибка изменения статуса задачи");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      console.log("✅ Задача удалена");
    } catch (error) {
      console.error("❌ Ошибка удаления задачи:", error);
      alert("Ошибка удаления задачи");
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  };

  // ✅ Функция для отображения приоритета
  const getPriorityText = (priority) => {
    switch (priority) {
      case 1:
        return { text: "Низкий", emoji: "🟢", class: "priority-low" };
      case 2:
        return { text: "Средний", emoji: "🟡", class: "priority-medium" };
      case 3:
        return { text: "Высокий", emoji: "🔴", class: "priority-high" };
      default:
        return { text: "Средний", emoji: "🟡", class: "priority-medium" };
    }
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка задач...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page" data testid="tasks-page">
      {/* Заголовок и статистика */}
      <div className="tasks-header">
        <div className="header-top">
          <button className="back-button" onClick={() => navigate("/profile")}>
            ← Назад к профилю
          </button>
          <h1>📋 Мои задачи</h1>
          <button
            className="create-task-button"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Новая задача
          </button>
        </div>

        <div className="task-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Всего</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Выполнено</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">В работе</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completionRate}%</span>
            <span className="stat-label">Прогресс</span>
          </div>
        </div>
      </div>

      {/* Управление и фильтры */}
      <div className="tasks-controls">
        <div className="filters">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Все задачи
          </button>
          <button
            className={`filter-button ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            В работе
          </button>
          <button
            className={`filter-button ${
              filter === "completed" ? "active" : ""
            }`}
            onClick={() => setFilter("completed")}
          >
            Выполненные
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск задач..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ошибки */}
      {error && <div className="error-message">{error}</div>}

      {/* Модальное окно создания задачи */}
      {showCreateForm && (
        <div className="create-task-modal">
          <div className="modal-content">
            <h3>➕ Создать новую задачу</h3>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Название задачи"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Описание задачи (необязательно)"
                value={newTask.content}
                onChange={(e) =>
                  setNewTask({ ...newTask, content: e.target.value })
                }
                rows="3"
              />
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: parseInt(e.target.value) })
                }
              >
                <option value={1}>🟢 Низкий приоритет</option>
                <option value={2}>🟡 Средний приоритет</option>
                <option value={3}>🔴 Высокий приоритет</option>
              </select>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="create-button">
                  Создать задачу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Список задач */}
      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <h3>📝 Нет задач</h3>
            <p>
              {tasks.length === 0
                ? "Создайте свою первую задачу!"
                : "Попробуйте изменить фильтр или поисковый запрос"}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const priorityInfo = getPriorityText(task.priority);
            return (
              <div
                key={task.id}
                className={`task-card ${task.completed ? "completed" : ""} ${
                  priorityInfo.class
                }`}
              >
                <div className="task-header">
                  <h3 className={task.completed ? "completed-text" : ""}>
                    {task.title}
                  </h3>
                  <span className="task-priority">{priorityInfo.emoji}</span>
                </div>

                {task.content && (
                  <div className="task-description">{task.content}</div>
                )}

                <div className="task-footer">
                  <span
                    className={`task-status ${
                      task.completed ? "completed" : "pending"
                    }`}
                  >
                    {task.completed ? "✅ Выполнено" : "⏳ В работе"}
                  </span>

                  <div className="task-actions">
                    <button
                      className={`status-button ${
                        task.completed ? "mark-pending" : "mark-completed"
                      }`}
                      onClick={() =>
                        handleToggleStatus(task.id, task.completed)
                      }
                    >
                      {task.completed ? "Отменить" : "Выполнить"}
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TasksPage;
