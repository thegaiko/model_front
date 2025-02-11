import React from 'react';

const cities = [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Казань",
    "Нижний Новгород",
    "Челябинск",
    "Самара",
    "Омск",
    "Ростов-на-Дону",
    "Уфа",
    "Красноярск",
    "Пермь",
    "Воронеж",
    "Волгоград",
    "Краснодар",
    "Саратов",
    "Тюмень",
    "Тольятти",
    "Ижевск",
    "Барнаул",
    "Ульяновск",
    "Иркутск",
    "Хабаровск",
    "Ярославль",
    "Владивосток",
    "Махачкала",
    "Томск",
    "Оренбург",
    "Кемерово",
    "Рязань",
    "Астрахань",
    "Набережные Челны",
    "Пенза",
    "Липецк",
    "Тула",
    "Киров",
    "Чебоксары",
    "Курск",
    "Калининград",
    "Улан-Удэ",
    "Ставрополь",
    "Магнитогорск",
    "Тверь",
    "Брянск",
    "Иваново",
    "Белгород",
    "Сочи",
    "Владимир",
    "Архангельск",
    "Сургут"
];

const Filters = ({ filters, onFilterChange }) => {
    return (
        <div className="filtersContainer">
            <div className="filterGroup">
                <label className="filterLabel">Пол:</label>
                <select className="filterInput" value={filters.gender} onChange={(e) => onFilterChange('gender', e.target.value)}>
                    <option value="all">Все</option>
                    <option value="women">Женщины</option>
                    <option value="men">Мужчины</option>
                </select>
            </div>

            <div className="filterGroup">
                <label className="filterLabel">Город:</label>
                <select className="filterInput" value={filters.city} onChange={(e) => onFilterChange('city', e.target.value)}>
                    <option value="">Все</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            <div className="filterInputGroup">
                <label className="filterLabel">Возраст:</label>
                <div className="inputLine">
                    <input
                        type="number"
                        className="filterSecInput"
                        placeholder="Мин."
                        value={filters.ageRange[0]}
                        onChange={(e) => onFilterChange('ageRange', [e.target.value, filters.ageRange[1]])}
                        min="0"
                    />
                    <input
                        type="number"
                        className="filterSecInput"
                        placeholder="Макс."
                        value={filters.ageRange[1]}
                        onChange={(e) => onFilterChange('ageRange', [filters.ageRange[0], e.target.value])}
                        min="0"
                    />
                </div>
            </div>

            <div className="filterInputGroup">
                <label className="filterLabel">Цена (₽/час):</label>
                <div className="inputLine">
                    <input
                        type="number"
                        className="filterSecInput"
                        placeholder="Мин."
                        value={filters.priceRange[0]}
                        onChange={(e) => onFilterChange('priceRange', [e.target.value, filters.priceRange[1]])}
                        min="0"
                    />
                    <input
                        type="number"
                        className="filterSecInput"
                        placeholder="Макс."
                        value={filters.priceRange[1]}
                        onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], e.target.value])}
                        min="0"
                    />
                </div>
            </div>
        </div>
    );
};

export default Filters;