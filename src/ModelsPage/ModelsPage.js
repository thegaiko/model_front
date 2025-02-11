import axios from 'axios';
import { useState, useEffect } from 'react';
import loadingGif from '../loading.gif';
import Filters from './Filters';
import Modal from './Modal';
import './ModelsPage.css';

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
  BackButton.onClick(function () {
    window.location.href = "/";
    BackButton.hide();
  });

  useEffect(() => {
    axios.get('https://persiscan.ru/api/items', { headers: { "Content-Type": "application/json" } })
        .then(response => {
          setItems(response.data);
          setCities([...new Set(response.data.map(item => item.city))].sort());
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => setIsLoading(false));
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: field === 'ageRange' || field === 'priceRange' ? value : value
    }));
  };

  const filteredItems = items.filter(item => {
    const matchesGender = filters.gender === 'all' || item.gender === filters.gender;
    const matchesCity = !filters.city || item.city === filters.city;
    const matchesAge = (!filters.ageRange[0] || item.age >= Number(filters.ageRange[0])) && (!filters.ageRange[1] || item.age <= Number(filters.ageRange[1]));
    const matchesPrice = (!filters.priceRange[0] || item.price >= Number(filters.priceRange[0])) && (!filters.priceRange[1] || item.price <= Number(filters.priceRange[1]));
    return matchesGender && matchesCity && matchesAge && matchesPrice;
  });

  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const goToNextImage = () => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedItem.other_photos.length);
  const goToPreviousImage = () => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedItem.other_photos.length) % selectedItem.other_photos.length);

  if (isLoading) return <div className="loadingModelsGif"><img src={loadingGif} alt="Loading" /></div>;

  return (
      <div className="ModelsPage">
        <Filters filters={filters} onFilterChange={handleFilterChange} />

        <div className="itemsList">
          {filteredItems.map((item, index) => (
              <div key={index} className="item">
                <div className="imagesContainer">
                  {item.other_photos.map((photo, photoIndex) => (
                      <img
                          key={photoIndex}
                          src={photo}
                          alt={`Photo ${photoIndex + 1}`}
                          className="modelAvatar"
                          onClick={() => openModal(item)}
                      />
                  ))}
                </div>
                <div>
                  <div className='nameBox'>
                    <div className="modelName">{item.name}</div>
                    <img className='modelInfoAvatar' src={item.avatar}/>
                  </div>
                  <div className='aboutBox'>
                    <div>
                      <div className="modelInfoText">Возраст: {item.age} лет</div>
                      <div className="modelInfoText">Прайс: {item.price} ₽/час</div>
                      <div className="modelInfoText">Город: {item.city}</div>
                      <div className="modelInfoText">О себе: {item.about}</div>
                    </div>
                    <div>
                      <div className="modelInfoText">Рост: {item.height} см</div>
                      <div className="modelInfoText">Параметры: {item.parameters}</div>
                      <div className="modelInfoText">Размер ноги: {item.leg}</div>
                    </div>
                  </div>
                  <div className="buttonPart">
                    <a href={`https://t.me/${item.link}`} className="selectButton">НАПИСАТЬ</a>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {isModalOpen && selectedItem && (
            <Modal
                selectedItem={selectedItem}
                currentImageIndex={currentImageIndex}
                goToNextImage={goToNextImage}
                goToPreviousImage={goToPreviousImage}
                closeModal={closeModal}
            />
        )}
      </div>
  );
}

export default ModelsPage;