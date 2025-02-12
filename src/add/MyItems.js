import React, { useEffect, useState } from 'react';
import {Button, Image} from 'antd';

const MyItems = ({ userId }) => {
    const [myItems, setMyItems] = useState([]);

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
                body: new URLSearchParams({ id }),
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
        <div>
            <h2 className='myItemsHeadText'>Ваши анкеты:</h2>
            <div className='myItems'>
                <div>
                    {myItems.map((item, index) => (
                        <div key={index} className="item">
                            <div>
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
                                                style={{ height: '250px', width: 'auto' }}
                                            />
                                        ))}
                                    </Image.PreviewGroup>
                                </div>
                            </div>
                            <div>
                                <div className="nameBox">
                                    <img className="modelInfoAvatar" src={item.avatar} alt="Avatar"/>
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
                                    <Button type="primary" htmlType="submit"
                                            onClick={() => deleteItem(item.id)}>УДАЛИТЬ</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyItems;