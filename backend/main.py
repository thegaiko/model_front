from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import json
import os
from pathlib import Path
import uvicorn
from uuid import uuid4
from fastapi.responses import FileResponse

class Item(BaseModel):
    id: str  # Уникальный идентификатор
    user_id: str
    name: str
    age: int
    price: int
    city: str
    gender: str
    other_photos: List[str]
    link: str  # Поле для ссылки
    about: str
    height: str
    parameters: str
    leg: str
    avatar: str

class NicknameRequest(BaseModel):
    nickname: str

# Инициализация FastAPI
app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все домены
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST и т.д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Путь к JSON файлу, где хранятся данные
FILE_PATH = "models.json"
REQ_FILE_PATH = "request_models.json"
ENTER_LOGS_PATH = "enter_logs.json"


# Папка для хранения загруженных файлов
UPLOAD_FOLDER = "/var/www/html/photos"
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)  # Создаем папку, если она не существует

# Функция для чтения данных из JSON файла
def read_data(path):
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)
    return []

# Функция для записи данных в JSON файл
def write_data(data, path):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Маршрут GET для получения всех элементов
@app.get("/api/items")
def get_items():
    res = read_data(FILE_PATH)
    return res

@app.post("/api/del_item")
async def del_item(id: str = Form(...)):
    res = read_data(FILE_PATH)

    # Находим элемент с данным id
    item_to_delete = next((item for item in res if item['id'] == id), None)

    if item_to_delete:
        # Удаляем фотографии из other_photos
        for photo_path in item_to_delete.get('other_photos', []):
            try:
                if os.path.exists(photo_path):
                    os.remove(photo_path)
            except Exception as e:
                print(f"Error deleting file {photo_path}: {e}")

        # Обновляем список, исключая удаленный элемент
        updated_items = [item for item in res if item['id'] != id]

        # Сохраняем обновленные данные
        write_data(updated_items, FILE_PATH)

        return {"message": "Item and associated photos deleted successfully"}
    else:
        return {"message": "Item not found"}

# Маршрут POST для получения всех элементов пользователя
@app.post("/api/my_items")
async def get_user_items(user_id: str = Form(...)):
    my_items = []
    res = read_data(FILE_PATH)
    for item in res:
        if item['user_id'] == user_id:
            my_items.append(item)

    return my_items

# Маршрут POST для добавления нового элемента с файлами
@app.post("/api/add_item")
async def add_item(
    user_id: str = Form(...),
    item_link: str = Form(...),
    name: str = Form(...),
    age: int = Form(...),
    price: int = Form(...),
    city: str = Form(...),
    gender: str = Form(...),
    other_photos: List[UploadFile] = File([]),  # Дополнительные фотографии
    about: str = Form(...),
    height: str = Form(...),
    parameters: str = Form(...),
    leg: str = Form(...),
    avatar: str = Form(...),
):
    # Сохраняем дополнительные фотографии
    other_photos_urls = []
    for other_photo in other_photos:
        file_extension = other_photo.filename.split('.')[-1]
        unique_filename = f"{uuid4()}.{file_extension}"  # Генерируем уникальное имя для фотографии

        # Сохраняем файл
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await other_photo.read())

        # Формируем ссылку на дополнительную фотографию
        other_photos_urls.append(f"https://persiscan.ru/photos/{unique_filename}")

    # Создаем объект для добавления в JSON
    item_id = str(uuid4())  # Генерируем уникальный ID

    new_item = {
        "id": item_id,
        "user_id": user_id,
        "name": name,
        "age": age,
        "price": price,
        "city": city,
        "gender": gender,
        "other_photos": other_photos_urls,
        "link": item_link,
        "about": about,
        "height": height,
        "parameters": parameters,
        "leg": leg,
        "avatar": avatar,

    }

    print(new_item)

    # Читаем текущие данные, добавляем новый элемент и сохраняем
    data = read_data(REQ_FILE_PATH)
    data.append(new_item)
    write_data(data, REQ_FILE_PATH)

    return {"message": "Заявка успешно отправлена! Ожидайте!", "id": item_id, "link": item_link}

# Маршрут для получения файла
@app.get("/uploads/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if Path(file_path).exists():
        return FileResponse(file_path)
    return {"error": "File not found"}

@app.post("/api/enter")
async def enter_user(data: NicknameRequest):
    nickname = data.nickname
    print(nickname)
    # Читаем логи, добавляем nickname и сохраняем
    logs = read_data(ENTER_LOGS_PATH)
    logs.append({"nickname": nickname})
    write_data(logs, ENTER_LOGS_PATH)
    return {"message": "Логин успешно записан", "nickname": nickname}


# Если файл запускается напрямую, то запускаем сервер с помощью uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


