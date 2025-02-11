import axios from 'axios';
import './ModelsPage.css';
import { useState, useEffect } from 'react';
import loadingGif from '../loading.gif';

function ModelsPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    gender: 'women',
    city: '',
    ageRange: ['', ''],
    priceRange: ['', ''],
  });
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  var BackButton = window.Telegram.WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(function() {
    window.location.href = "/";
    BackButton.hide();
  });

  useEffect(() => {
    axios.get('https://persiscan.ru/api/items', {
      headers: {
        "Content-Type": "application/json",
      },
    })
        .then(response => {
          setItems(response.data);
          const uniqueCities = [...new Set(response.data.map(item => item.city))].sort();
          setCities(uniqueCities);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
  }, []);

  // Фильтрация элементов
  const filteredItems = items.filter(item => {
    const matchesGender = filters.gender === 'all' || item.gender === filters.gender;
    const matchesCity = !filters.city || item.city === filters.city;
    const matchesAge = (!filters.ageRange[0] || item.age >= Number(filters.ageRange[0])) && (!filters.ageRange[1] || item.age <= Number(filters.ageRange[1]));
    const matchesPrice = (!filters.priceRange[0] || item.price >= Number(filters.priceRange[0])) && (!filters.priceRange[1] || item.price <= Number(filters.priceRange[1]));

    return matchesGender && matchesCity && matchesAge && matchesPrice;
  });

  const handleFilterChange = (field, value) => {
    if (field === 'ageRange' || field === 'priceRange') {
      setFilters(prevFilters => ({
        ...prevFilters,
        [field]: value,
      }));
    } else {
      setFilters({ ...filters, [field]: value });
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0); // Начинаем с первого изображения
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const goToNextImage = () => {
    if (selectedItem && selectedItem.other_photos) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedItem.other_photos.length);
    }
  };

  const goToPreviousImage = () => {
    if (selectedItem && selectedItem.other_photos) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedItem.other_photos.length) % selectedItem.other_photos.length);
    }
  };

  if (isLoading) {
    return (
        <div className="ModelsPage">
          <img className="loadingModelsGif" src={loadingGif} alt="Loading gif" />
        </div>
    );
  }

  return (
      <div className="ModelsPage">
        <div className="filtersContainer">
          {/* Пол */}
          <div className="filterGroup">
            <div className="selectBox">
              <label className="filterLabel">Пол:</label>
              <select
                  className="filterInput"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="all">Все</option>
                <option value="women">Женщины</option>
                <option value="men">Мужчины</option>
              </select>
            </div>
          </div>

          {/* Город */}
          <div className="filterGroup">
            <div className="selectBox">
              <label className="filterLabel">Город:</label>
              <select
                  className="filterInput"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                <option value="">Все</option>
                {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Возраст */}
          <div className="filterInputGroup">
            <label className="filterLabel">Возраст:</label>
            <div className="inputLine">
              <input
                  type="number"
                  className="filterInput"
                  placeholder="Мин."
                  value={filters.ageRange[0]}
                  onChange={(e) => handleFilterChange('ageRange', [e.target.value, filters.ageRange[1]])}
                  min="0"
              />
              <input
                  type="number"
                  className="filterInput"
                  placeholder="Макс."
                  value={filters.ageRange[1]}
                  onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], e.target.value])}
                  min="0"
              />
            </div>
          </div>

          {/* Цена */}
          <div className="filterInputGroup">
            <label className="filterLabel">Цена (₽/час):</label>
            <div className="inputLine">
              <input
                  type="number"
                  className="filterInput"
                  placeholder="Мин."
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [e.target.value, filters.priceRange[1]])}
                  min="0"
              />
              <input
                  type="number"
                  className="filterInput"
                  placeholder="Макс."
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], e.target.value])}
                  min="0"
              />
            </div>
          </div>
        </div>

        {/* Отображение элементов массива */}
        <div className="itemsList">
          {filteredItems.map((item, index) => (
              <div key={index} className="item">
                <div>
                  <div className="imagesContainer">
                    {item.other_photos.map((photo, photoIndex) => (
                        <img
                            key={photoIndex}
                            src={photo}
                            alt={`Photo ${photoIndex + 1}`}
                            className="modelAvatar"
                            onClick={() => openModal(item)} // открытие модального окна
                        />
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
          ))}
        </div>

        {/* Модальное окно с каруселью */}
        {isModalOpen && selectedItem && (
            <div className="modal" onClick={closeModal}>
              <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <button className="carouselBtn prev" onClick={goToPreviousImage}>‹</button>
                <img
                    src={selectedItem.other_photos[currentImageIndex]}
                    alt="Selected"
                    className="modalImage"
                />
                <button className="carouselBtn next" onClick={goToNextImage}>›</button>
              </div>
            </div>
        )}
      </div>
  );
}

export default ModelsPage;