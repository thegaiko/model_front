import React from 'react';
import { Link } from 'react-router-dom';  // Импортируем Link
import './Home.css';
import catgif from './home.gif';


function Home() {
  return (
    <div className='Home'>
        <img className="catGif" src={catgif} alt="Cat gif"/>
        <div className="headText">Общая информация 📸</div>
        <div className="text">Приложение для поиска моделей для вашей фото или видео съемки. </div>
        <div className='buttonsBar'>
            <Link className='homeBtn' to="/models">Модели</Link>
            <Link className='homeBtn' to="/add">Добавить свою анкету</Link>
        </div>
    </div>
  );
}

export default Home;