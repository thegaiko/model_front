import axios from 'axios';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import loadingGif from '../loading.gif';
import Filters from './Filters';
import { Button, Image } from 'antd';
import './ModelsPage.css';

let tg = window.Telegram?.WebApp;

const senderUsername = tg?.initDataUnsafe?.user?.username || "-";

function ModelsPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    gender: 'all',
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

  const sendMessage = async (author) => {
    try {
      await axios.post('https://persiscan.ru/api/message', {
        author: author,
        sender: senderUsername
      });
      console.log(`Message sent: { author: ${author}, sender: ${senderUsername} }`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
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

  return (
      <motion.div
          className="ModelsPage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
      >
        <Filters filters={filters} onFilterChange={handleFilterChange} />

        <motion.div
            className="itemsList"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          {filteredItems.map((item, index) => (
              <motion.div
                  key={index}
                  className="item"
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.3, delay: index * 0.1}}
              >
                <div className="imagesContainer">
                  <Image.PreviewGroup
                      preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                      }}
                  >
                    {item.other_photos.map((photo, photoIndex) => (
                        <Image
                            key={photoIndex}
                            src={photo}
                            alt={`Photo ${photoIndex + 1}`}
                            className="modelAvatar"
                            style={{height: '250px', width: 'auto'}}
                            onClick={() => openModal(item)}
                        />
                    ))}
                  </Image.PreviewGroup>
                </div>
                <div>
                  <div className="nameBox">
                    <a onClick={() => sendMessage(item.link)} href={`https://t.me/${item.link}`}><img className="modelInfoAvatar" src={item.avatar} alt="Avatar"/></a>
                    <div>
                      <div className="modelName">{item.name}</div>
                      <div className='modelInfoTextBox'>
                        <div className="modelAboutTextName"><strong>О себе:</strong></div>
                        <div className="modelAboutText">{item.about}</div>
                      </div>
                    </div>
                  </div>
                  <div className="aboutBox">
                  <div>
                      <div className='modelInfoTextBox'>
                        <div className="modelInfoTextName"><strong>Возраст:</strong></div>
                        <div className="modelInfoText">{item.age} лет</div>
                      </div>
                      <div className='modelInfoTextBox'>
                        <div className="modelInfoTextName"><strong>Прайс:</strong></div>
                        <div className="modelInfoText">{item.price} (час)</div>
                      </div>
                      <div className='modelInfoTextBox'>
                        <div className="modelInfoTextName"><strong>Город:</strong></div>
                        <div className="modelInfoText">{item.city}</div>
                      </div>
                      <div className='modelInfoTextBox'>
                        <div className="modelInfoTextName"><strong>Параметры:</strong></div>
                        <div className="modelInfoText">{item.parameters}</div>
                      </div>
                    </div>
                    <div>
                      <div className='modelInfoTextBox'>
                        <div className="modelInfoTextName"><strong>Рост:</strong></div>
                        <div className="modelInfoText">{item.height}</div>
                      </div>
                      <div className='modelInfoTextBox'>
                        <div className="modelInfoTextName"><strong>Размер ноги:</strong></div>
                        <div className="modelInfoText">{item.leg}</div>
                      </div>
                    </div>
                  </div>
                  <div className="buttonPart">
                    <Button
                      type="primary"
                      href={`https://t.me/${item.link}`}
                      onClick={() => sendMessage(item.link)}
                    >
                      НАПИСАТЬ
                    </Button>
                  </div>
              </div>
            </motion.div>
            ))}
        </motion.div>
      </motion.div>
  );
}

export default ModelsPage;
