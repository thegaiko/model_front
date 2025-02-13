import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import telegramAnalytics from '@telegram-apps/analytics';

window.Telegram.WebApp.disableVerticalSwipes()

telegramAnalytics.init({
    token: 'eyJhcHBfbmFtZSI6ImdhaWtvIiwiYXBwX3VybCI6Imh0dHBzOi8vdC5tZS9ydW1vZGVsc19ib3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly90Lm1lL3J1bW9kZWxzX2JvdD9zdGFydGFwcCJ9!VQ9EW5VlrjmZa0jc4UIZTy746c0UAiWV4a+KKejBEiE=',
    appName: 'gaiko',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
