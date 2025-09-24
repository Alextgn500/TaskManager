from sqlalchemy import text
from app.backend.db import AsyncSessionLocal
from app.models.user_m import Users
from app.models.task_m import Tasks

async def create_test_data():
    """Создает тестовые данные"""
    async with AsyncSessionLocal() as session:
        try:
            # Проверяем есть ли уже данные
            result = await session.execute(text("SELECT COUNT(*) FROM users"))
            count = result.scalar()
            
            if count > 0:
                print("✅ Данные уже существуют")
                return
                
            print("📝 Создаем тестовые данные...")
            
            # Создаем тестового пользователя с ID 29
            test_user = Users(
                id=29,
                username="DP", 
                firstname="Дмитрий",
                lastname="Петров",
                age=25,
                slug="dp",
                password="deep"
            )
            
            session.add(test_user)
            await session.commit()
            print("✅ Пользователь создан: ID=29, Username=DP")
            
        except Exception as e:
            print(f"❌ Ошибка создания данных: {e}")
            await session.rollback()
