import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Add.css';

function Add() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [selectedGender, setSelectedGender] = useState('women');
  const [otherPhotos, setOtherPhotos] = useState([]);
  const [myItems, setMyItems] = useState([]); // Состояние для хранения пользовательских элементов

  let tg = window.Telegram?.WebApp;

  const userFirstName = tg?.initDataUnsafe?.user?.first_name || "Гость";
  const userId = tg?.initDataUnsafe?.user?.id || "-";
  const userName = tg?.initDataUnsafe?.user?.username || "-";

  var BackButton = window.Telegram.WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(function () {
    window.location.href = "/";
    BackButton.hide();
  });

  const handleOtherPhotosChange = (e) => {
    setOtherPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('item_link', userName);
    formData.append('name', name);
    formData.append('age', age);
    formData.append('price', price);
    formData.append('city', city);
    formData.append('gender', selectedGender);

    otherPhotos.forEach((photo) => {
      formData.append('other_photos', photo);
    });

    try {
      const response = await fetch('https://persiscan.ru/api/add_item', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Item added successfully!');
        setName('');
        setAge('');
        setPrice('');
        setCity('');
        setSelectedGender('women');
        setOtherPhotos([]);
        fetchMyItems(); // Обновляем список после добавления нового элемента
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };

  const fetchMyItems = async () => {
    try {
      const response = await fetch('https://persiscan.ru/api/my_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ user_id: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setMyItems(data);
      } else {
        console.error('Failed to fetch items:', data.message);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch('https://persiscan.ru/api/del_item', {
        method: 'POST',
        body: new URLSearchParams({ id: id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Item deleted successfully!');
        // Обновляем список после удаления элемента
        setMyItems(myItems.filter(item => item.id !== id));
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error deleting the item.');
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  return (
    <div className='Add'>
      <h1 className='headerText'>Создайте свою анкету</h1>
      <div className='inputLabel'>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='inputTypeText'>Имя</label>
            <input
              className='nameInput'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='Иван'
            />
          </div>
          <div className='line'></div>
          <div>
            <label className='inputTypeText'>Возраст</label>
            <input
              className='ageInput'
              placeholder='23'
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className='line'></div>
          <div>
            <label className='inputTypeText'>Прайс за 1 час</label>
            <input
              className='priceInput'
              placeholder='1000'
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className='line'></div>
          <div>
            <label className='inputTypeText'>Город</label>
            <input
              className='cityInput'
              placeholder='Москва'
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className='line'></div>
          <div className="genderAddContainer">
            <label className='inputTypeText'>Пол:</label>
            <div className="genderAddSelect">
              <div
                className={`genderAddText ${selectedGender === 'women' ? 'active' : ''}`}
                onClick={() => setSelectedGender('women')}
              >
                Женщина
              </div>
              <div
                className={`genderAddText ${selectedGender === 'men' ? 'active' : ''}`}
                onClick={() => setSelectedGender('men')}
              >
                Мужчина
              </div>
            </div>
          </div>
          <div className='line'></div>
          <div>
            <label className='inputTypeText'>Фотографии:</label>
            <input
              className='fileBtn'
              type="file"
              multiple
              onChange={handleOtherPhotosChange}
            />
          </div>
          <button className='submitBtn' type="submit">ОТПРАВИТЬ</button>
        </form>
      </div>
      <h2 className='modelName'>Ваши анкеты:</h2>
      <div className='myItems'>
        <div>
          {myItems.map((item, index) => (
            <div key={index} className="item">
              <div>
                {/* Отображение всех изображений из other_photos */}
                <div className="imagesContainer">
                  {item.other_photos.map((photo, photoIndex) => (
                    <img key={photoIndex} src={photo} alt={`Photo ${photoIndex + 1}`} className="modelAvatar" />
                  ))}
                </div>
              </div>
              <div>
                <div className="modelName">{item.name}</div>
                <div className="modelInfoText">
                  <div className="infoText">Возраст </div>
                  <div className="modelInfo">{item.age} лет</div>
                </div>
                <div className="modelInfoText">
                  <div className="infoText">Прайс </div>
                  <div className="modelInfo">{item.price} ₽/час</div>
                </div>
                <div className="modelInfoText">
                  <div className="infoText">Город </div>
                  <div className="modelInfo">{item.city}</div>
                </div>
                <div className="modelInfoText">
                  <div className="infoText">ID </div>
                  <div className="modelInfo">{item.id}</div>
                </div>
                <div className="buttonPart">
                  <button className="selectButton" onClick={() => deleteItem(item.id)}>УДАЛИТЬ</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Add;