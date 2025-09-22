`markdown
# TaskManager - Система управления задачами

Полнофункциональное веб-приложение для управления задачами с React frontend и FastAPI backend.

## Структура проекта

- `taskmanager_api/` - Backend на FastAPI REST Framework
- `frontend_tm/` - Frontend на React
- `docker-compose.yml` - Конфигурация для запуска всех сервисов

## Быстрый старт

1. Клонируйте репозиторий
2. Запустите приложение:

```bash
docker-compose up --build
```

3. Откройте в браузере:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Управление контейнерами

```bash
# Запуск в фоновом режиме
docker-compose up -d --build

# Остановка всех сервисов
docker-compose down

# Просмотр логов
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres

# Пересборка конкретного сервиса
docker-compose build frontend