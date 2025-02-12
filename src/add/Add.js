import React, { useEffect, useState } from 'react';
import {
  Button,
  Cascader,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MyItems from './MyItems';
import './Add.css'

const { Option } = Select;

const cities = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону", "Уфа", "Красноярск", "Пермь", "Воронеж", "Волгоград", "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск", "Барнаул", "Ульяновск", "Иркутск", "Хабаровск", "Ярославль", "Владивосток", "Махачкала", "Томск", "Оренбург", "Кемерово", "Рязань", "Астрахань", "Набережные Челны", "Пенза", "Липецк", "Тула", "Киров", "Чебоксары", "Курск", "Калининград", "Улан-Удэ", "Ставрополь", "Магнитогорск", "Тверь", "Брянск", "Иваново", "Белгород", "Сочи", "Владимир", "Архангельск", "Сургут"
];

let tg = window.Telegram?.WebApp;

const userId = tg?.initDataUnsafe?.user?.id || "-";
const userName = tg?.initDataUnsafe?.user?.username || "-";
const avatar = tg?.initDataUnsafe?.user?.photo_url || "-";


const Add = () => {
  const [form] = Form.useForm();
  const [myItems, setMyItems] = useState([]);

  var BackButton = window.Telegram.WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(function () {
    window.location.href = "/";
    BackButton.hide();
  });

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

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('item_link', userName);
    formData.append('name', values.name);
    formData.append('age', values.age);
    formData.append('price', values.price);
    formData.append('city', values.city);
    formData.append('about', values.about);
    formData.append('height', values.height);
    formData.append('parameters', values.parameters);
    formData.append('leg', values.leg);
    formData.append('gender', values.gender);
    formData.append('avatar', avatar);

    if (values.photos && values.photos.fileList) {
      values.photos.fileList.forEach(file => {
        formData.append('other_photos', file.originFileObj);
      });
    }

    try {
      const response = await fetch('https://persiscan.ru/api/add_item', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Заявка на добавление анкеты отправлена, ожидайте рассмотрения!');
        form.resetFields();
        fetchMyItems();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center'}}>Заявка на публикацию анкеты</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item className="custom-label" label="Имя" name="name" rules={[{ required: true, message: 'Введите имя!' }]}>
            <Input placeholder="Иван" maxLength={12}/>
          </Form.Item>
          <Form.Item label="Возраст" name="age" rules={[{ required: true, message: 'Введите возраст!' }]}>
            <InputNumber placeholder="23" style={{ width: '100%' }} maxLength={3}/>
          </Form.Item>
          <Form.Item label="Прайс за час" name="price" rules={[{ required: true, message: 'Введите цену!' }]}>
            <InputNumber placeholder="1000" style={{ width: '100%' }} maxLength={5}/>
          </Form.Item>
          <Form.Item label="Город" name="city" rules={[{ required: true, message: 'Выберите город!' }]}>
            <Select placeholder="Выберите город">
              {cities.map((city, index) => (
                  <Option key={index} value={city}>{city}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="О себе" name="about" rules={[{ required: true, message: 'Расскажите о себе!' }]}>
            <Input.TextArea placeholder="Расскажите о себе" maxLength={50} />
          </Form.Item>
          <Form.Item label="Рост" name="height" rules={[{ required: true, message: 'Введите рост!' }]}>
            <InputNumber placeholder="170" style={{ width: '100%' }} maxLength={3} />
          </Form.Item>
          <Form.Item label="Параметры" name="parameters" rules={[{ required: true, message: 'Введите параметры!' }]}>
            <Input placeholder="90-60-90" maxLength={15} />
          </Form.Item>
          <Form.Item label="Размер ноги" name="leg" rules={[{ required: true, message: 'Введите размер ноги!' }]}>
            <Input placeholder="37" maxLength={3}/>
          </Form.Item>
          <Form.Item label="Пол" name="gender" rules={[{ required: true, message: 'Выберите пол!' }]}>
            <Select placeholder="Выберите пол">
              <Option value="women">Женщина</Option>
              <Option value="men">Мужчина</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Фотографии" name="photos">
            <Upload multiple beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Загрузить фотографии</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Отправить</Button>
          </Form.Item>
        </Form>
        <MyItems userId={userId} />
      </div>
  );
};

export default Add;