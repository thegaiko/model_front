import axios from 'axios';
import './ModelsPage.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backBtn from '../back.svg';


function ModelsPage() {
  // Состояние для данных и выбранного пола
  const [items, setItems] = useState([]);
  const [selectedGender, setSelectedGender] = useState('women');
  const [currentIndexes, setCurrentIndexes] = useState({});

  var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.show();
    BackButton.onClick(function() {
        window.location.href = "/"; 
        BackButton.hide();
    });

  // Загрузка данных с API с использованием axios
  useEffect(() => {
    axios.get('https://persiscan.ru/api/items', {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        setItems(response.data);  // Сохраняем полученные данные в состояние
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Фильтрация элементов по выбранному полу
  const filteredItems = items.filter(item => item.gender === selectedGender);

  return (
    <div className="ModelsPage">
        <div className="genderSelectContainer">
          <div className="genderSelect">
            <div
              className={`genderText ${selectedGender === 'women' ? 'active' : ''}`}
              onClick={() => setSelectedGender('women')}
            >
              Женщины
            </div>
            <div
              className={`genderText ${selectedGender === 'men' ? 'active' : ''}`}
              onClick={() => setSelectedGender('men')}
            >
              Мужчины
            </div>
          </div>
      </div>

      {/* Отображение элементов массива */}
      <div className="itemsList">
        {filteredItems.map((item, index) => {
          const currentIndex = currentIndexes[item.id] || 0; // Use the item's id to keep track of its index

          return (
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
                  <div className="infoText">Возраст: </div>
                  <div className="modelInfo">{item.age} лет</div>
                </div>
                <div className="modelInfoText">
                  <div className="infoText">Прайс: </div>
                  <div className="modelInfo">{item.price} ₽/час</div>
                </div>
                <div className="modelInfoText">
                  <div className="infoText">Город: </div>
                  <div className="modelInfo">{item.city}</div>
                </div>
                <div className="buttonPart">
                  <a href={`https://t.me/${item.link}`} className="selectButton">
                      НАПИСАТЬ
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ModelsPage;