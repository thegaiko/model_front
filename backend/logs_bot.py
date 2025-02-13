import json
import os
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.utils import executor
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio

API_TOKEN = '7892701494:AAFhpDwr27zHKJIJSup_C-C1Dql1UAMOd58'  # Замените на ваш API токен бота
CHAT_ID = '664207030'  # Замените на ID вашего чата
ENTER_LOGS_FILE = 'enter_logs.json'

# Устанавливаем логирование
logging.basicConfig(level=logging.INFO)

# Создаем экземпляры бота и диспетчера
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Для отслеживания состояния файла
last_checked = 0

# Чтение содержимого JSON файла
def read_json(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Проверка изменений в JSON файле
async def check_new_entries():
    global last_checked
    entries = read_json(ENTER_LOGS_FILE)
    current_count = len(entries)
    if current_count > last_checked:  # Проверяем, изменилось ли количество элементов
        for i in range(last_checked, current_count):  # Обрабатываем только новые элементы
            await send_new_entry_notification(entries[i])
        last_checked = current_count  # Обновляем счётчик до текущего количества элементов

# Отправка уведомления о новом никнейме
async def send_new_entry_notification(entry):
    message_text = f"Новая запись в журнале: @{entry['nickname']}"
    await bot.send_message(CHAT_ID, message_text)

# Настроим периодическую проверку каждые 1 секунду
async def on_start():
    await bot.send_message(CHAT_ID, 'Начали')
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_new_entries, 'interval', seconds=1)
    scheduler.start()

    # Чтобы цикл событий оставался активным
    while True:
        await asyncio.sleep(1)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(on_start())
    executor.start_polling(dp, skip_updates=True)