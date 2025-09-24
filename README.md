`markdown
# TaskManager - Система управления задачами

Полнофункциональное веб-приложение для управления задачами с React frontend и FastAPI backend.

🚀 Технологии

**Backend:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Python 3.9+

**Frontend:**
- React.js
- React Router
- CSS3

**Инфраструктура:**
- Docker
- Docker Compose


- `taskmanager_api/` - Backend на FastAPI REST Framework
- `frontend_tm/` - Frontend на React
- `docker-compose.yml` - Конфигурация для запуска всех сервисов

- 
   Откройте в браузере:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API документация:** http://localhost:8000/docs

## ✨ Функциональность

- ✅ Регистрация пользователей
- ✅ Аутентификация
- ✅ Управление профилем
- ✅ CRUD операции с пользователями
- ✅ REST API
- 🔄 Управление задачами 

## 🔌 API Endpoints

### Пользователи
- `POST /api/register` - Регистрация
- `POST /api/login` - Авторизация
- `GET /api/users/` - Список пользователей
- `GET /api/users/{id}` - Пользователь по ID
- `PUT /api/users/{id}` - Обновление пользователя
- `DELETE /api/users/{id}` - Удаление пользователя

### Задачи
- `GET /api/tasks/` - Список задач
- `POST /api/tasks/` - Создание задачи
- `GET /api/tasks/{id}` - Задача по ID
- `PUT /api/tasks/{id}` - Обновление задачи
- `DELETE /api/tasks/{id}` - Удаление задачи

## 📁 Структура проекта
TaskManager/
├── taskmanagerapi/     # FastAPI приложение
│   ├── main.py         # Основной файл приложения
│   ├── app/
│   │   └── backend/    # Модели и логика
│   ├── requirements.txt
│   └── dockerfile
├── taskmanagerfrontend/ # React приложение
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── package.json
│   └── dockerfile
├── docker-compose.yml  # Конфигурация Docker
└── README.md

- `taskmanager_api/` - Backend на FastAPI REST Framework
- `frontend_tm/` - Frontend на React
- `docker-compose.yml` - Конфигурация для запуска всех сервисов

## 🛠️ Разработка

Для разработки используйте:
docker-compose up --build

Логи контейнеров:
docker-compose logs taskmanager_backend
docker-compose logs taskmanager_frontend
docker-compose logs taskmanager_db

Остановка:
docker-compose down


## 🗄️ База данных

Проект использует PostgreSQL в Docker контейнере. 
Данные сохраняются в volume `postgres_data`.











