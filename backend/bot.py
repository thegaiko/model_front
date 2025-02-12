import json
import os
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.types import ParseMode, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio

API_TOKEN = '7824179408:AAERMD4AxyKMFKgj5ZWTSvSc235c2RdQuzI'  # Замените на ваш API токен бота
CHANNEL_ID = 664207030  # Укажите ID канала, куда нужно отправлять данные
REQUEST_FILE = 'request_models.json'
MODELS_FILE = 'models.json'

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

# Запись в JSON файл
def write_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Проверка изменений в JSON файле
async def check_new_requests():
    global last_checked
    requests = read_json(REQUEST_FILE)  # Замените на асинхронное чтение, если возможно
    current_count = len(requests)
    if current_count > last_checked:  # Проверяем, изменилось ли количество элементов
        for i in range(last_checked, current_count):  # Обрабатываем только новые элементы
            await send_request_to_channel(requests[i])
        last_checked = current_count  # Обновляем счётчик до текущего количества элементов

# Отправка нового запроса в канал с кнопками
async def send_request_to_channel(request):
    keyboard = InlineKeyboardMarkup()
    accept_button = InlineKeyboardButton(text="Accept", callback_data=f"accept_{request['id']}")
    deny_button = InlineKeyboardButton(text="Deny", callback_data=f"deny_{request['id']}")

    keyboard.add(accept_button, deny_button)

    await bot.send_message(
        CHANNEL_ID,
        f"Новый запрос:\nИмя: {request['name']}\nТелеграм: {request['link']}",
        reply_markup=keyboard
    )

# Хэндлер для нажатий на кнопки (Accept/Deny)
@dp.callback_query_handler(lambda c: c.data and c.data.startswith(('accept_', 'deny_')))
async def process_request(callback_query: types.CallbackQuery):
    action, request_id = callback_query.data.split('_')

    # Чтение текущего состояния файлов
    requests = read_json(REQUEST_FILE)
    models = read_json(MODELS_FILE)

    # Поиск нужного запроса
    request = next((req for req in requests if req['id'] == request_id), None)

    if not request:
        await callback_query.answer("Запрос не найден.")
        return

    if action == 'accept':
        # Добавление запроса в models.json
        models.append(request)
        write_json(MODELS_FILE, models)
        await callback_query.answer(f"Запрос {request_id} принят!")
    elif action == 'deny':
        await callback_query.answer(f"Запрос {request_id} отклонен!")

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

# Настроим периодическую проверку каждые 10 секунд
async def on_start():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_new_requests, 'interval', seconds=1)  # Проверяем каждые 10 секунд
    scheduler.start()

    # Для того, чтобы запустить цикл событий
    while True:
        await asyncio.sleep(1)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(on_start())
    executor.start_polling(dp, skip_updates=True)
