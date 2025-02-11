import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Add.css';
import back from './back.svg';

function Add() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [height, setHeight] = useState('');
  const [parameters, setParameters] = useState('');
  const [leg, setLeg] = useState('');
  const [selectedGender, setSelectedGender] = useState('women');
  const [otherPhotos, setOtherPhotos] = useState([]);
  const [myItems, setMyItems] = useState([]);

  let tg = window.Telegram?.WebApp;

  const userFirstName = tg?.initDataUnsafe?.user?.first_name || "Гость";
  const userId = tg?.initDataUnsafe?.user?.id || "-";
  const userName = tg?.initDataUnsafe?.user?.username || "-";
  const avatar = tg?.initDataUnsafe?.user?.photo_url || "-";

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
    formData.append('about', about);
    formData.append('height', height);
    formData.append('parameters', parameters);
    formData.append('leg', leg);
    formData.append('avatar', avatar);

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
        setAbout('');
        setHeight('');
        setParameters('');
        setLeg('');
        setOtherPhotos([]);
        fetchMyItems();
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
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Имя</label></div>
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
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Возраст</label></div>
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
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Прайс за час</label></div>
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
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Город</label></div>
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
            <div className='infoInputBoxAbout'>
              <label className='inputTypeText'>О себе</label>
              <textarea
                  className='aboutInput'
                  placeholder='Расскажите о себе'
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  required
                  maxlength="100"
              />
            </div>
            <div className='line'></div>
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Рост</label></div>
              <input
                  className='heightInput'
                  placeholder='170'
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
              />
            </div>
            <div className='line'></div>
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Параметры</label></div>
              <input
                  className='parametersInput'
                  placeholder='90-60-90'
                  type="text"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  required
              />
            </div>
            <div className='line'></div>
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Размеры ноги</label></div>
              <input
                  className='legInput'
                  placeholder='37'
                  type="text"
                  value={leg}
                  onChange={(e) => setLeg(e.target.value)}
                  required
              />
            </div>
            <div className='line'></div>
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Пол</label></div>
              <div className="genderAddSelect">
                <select
                    className="genderSelect"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="women">Женщина</option>
                  <option value="men">Мужчина</option>
                </select>
              </div>
            </div>
            <div className='line'></div>
            <div className='infoInputBox'>
              <div className='inputTypeText'><label>Фотографии</label></div>

              <div className="image-upload">
                <label htmlFor="file-input">
                  <div className="inputFileBox">
                    <div className="fileUploadBtn"></div>
                  </div>
                </label>
                <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleOtherPhotosChange}
                />
              </div>
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
                      <button className="delButton" onClick={() => deleteItem(item.id)}>УДАЛИТЬ</button>
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