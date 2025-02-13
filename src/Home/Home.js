import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Импортируем Framer Motion
import './Home.css';
import homephoto from './home.png';
import loadingGif from '../loading.gif';

function Home() {
    const [isLoading, setIsLoading] = useState(true);

    // Получаем nickname из Telegram WebApp
    const tg = window.Telegram?.WebApp;
    const userName = tg?.initDataUnsafe?.user?.username || "-";

    // Эффект для отправки запроса при открытии страницы
    useEffect(() => {
        const sendNickname = async () => {
            try {
                const response = await fetch("https://persiscan.ru/api/enter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nickname: userName }),
                });

                if (!response.ok) {
                    console.error("Failed to send nickname", await response.text());
                } else {
                    console.log("Nickname sent successfully");
                }
            } catch (error) {
                console.error("Error sending nickname", error);
            }
        };

        sendNickname();
    }, [userName]);

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
        <motion.div
            className='Home'
            initial={{ opacity: 0, y: 50 }} // Начальная анимация
            animate={{ opacity: 1, y: 0 }}   // Анимация при появлении
            transition={{ duration: 0.8 }}    // Длительность анимации
        >
            <motion.img
                className="homephoto"
                src={homephoto}
                alt="Cat gif"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.div
                className='buttonsBar'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
            >
                <Link className='homeBtn' to="/models">Модели</Link>
                <Link className='homeBtn' to="/add">Добавить свою анкету</Link>
            </motion.div>
            <motion.a
                className='authorText'
                href="https://www.behance.net/gallery/217991815/Art-and-fun?tracking_source=for_you_logged_in_feed_recommended"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
            >
                photo by Valentina Sidamonidze
            </motion.a>
        </motion.div>
    );
}

export default Home;
