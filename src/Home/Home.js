import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link
import './Home.css';
import catgif from './home.gif';
import loadingGif from '../loading.gif';

function Home() {
    const [isLoading, setIsLoading] = useState(true);

    // Эффект для симуляции загрузки
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Например, 2 секунды ожидания

        return () => clearTimeout(loadingTimer); // Очищаем таймер при размонтировании
    }, []);

    if (isLoading) {
        return (
            <div className="Home">
                <img className="loadingGif" src={loadingGif} alt="Loading gif" />
            </div>
        );
    }

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