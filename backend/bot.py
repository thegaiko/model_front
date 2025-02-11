from aiogram import Bot, Dispatcher, types
from aiogram.types import ParseMode
from aiogram.utils import executor
import logging

API_TOKEN = '7824179408:AAERMD4AxyKMFKgj5ZWTSvSc235c2RdQuzI'  # Замените на ваш API токен бота

# Устанавливаем логирование
logging.basicConfig(level=logging.INFO)

# Создаем экземпляры бота и диспетчера
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Хэндлер для команды /start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    # Создаем кнопку для старта miniApp
    keyboard = types.InlineKeyboardMarkup()
    miniapp_button = types.InlineKeyboardButton(
        text="Запустить Mini App", 
        url="https://t.me/rumodels_bot?startapp"  # Замените на ссылку вашего mini app
    )
    
    # Добавляем кнопку на клавиатуру
    keyboard.add(miniapp_button)
    
    # Отправляем сообщение с кнопкой
    await message.answer(
        "Привет! Нажми на кнопку ниже, чтобы запустить приложение!", 
        reply_markup=keyboard
    )

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)