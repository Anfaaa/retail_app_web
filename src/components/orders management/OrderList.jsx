import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetOrders, UpdateOrder } from '../../API';
import '../../styles/list-page.css';
import './order-list.css'

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const navigate = useNavigate();
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const user_position = user_info.position_data.name.trim().toLowerCase();
    console.log(user_position)

    useEffect(() => {
        const user = localStorage.getItem('user_info');
        if (!user) {
        navigate('/');
        } else {
        const fetchOrders = async () => {
            try {
            const response = await GetOrders();
            setOrders(response.data);
            console.log(response.data)
            } catch (err) {
            setError('Ошибка загрузки заказов');
            } finally {
            setLoading(false);
            }
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // Запрос каждые 5 секунд

        return () => clearInterval(interval);
        }
    }, [navigate]);

      // Функция для обработки принятия заказа на себя
    const AddDeliveryDriver = async (orderId, assigned_person) => {
        if (window.confirm('Вы уверены, что хотите взяться за заказ?')) {
            try {
            const response = await UpdateOrder(orderId, {
                "delivery_driver_id": assigned_person
            });
            console.log('Ответ сервера:', response);
            alert('Заказ Ваш!');
            } catch (err) {
            console.error('Ошибка при принятии заказа:', err);
            }
        };
    };
    const AddOrderPicker = async (orderId, assigned_person) => {
        if (window.confirm('Вы уверены, что хотите взяться за заказ?')) {
            try {
            const response = await UpdateOrder(orderId, {
                "order_picker_id": assigned_person
            });
            console.log('Ответ сервера:', response);
            alert('Заказ Ваш!');
            } catch (err) {
            console.error('Ошибка при принятии заказа:', err);
            }
        };
    };
    // Получение уникальных значений для фильтров
    const uniqueStores = [...new Set(orders.map(order => order.store.address))];
    const uniqueStates = [...new Set(orders.map(order => order.state))];
    const uniqueEmployees = [
        ...new Set(
        orders.flatMap(order => [
            order.delivery_driver ? `${order.delivery_driver.name} ${order.delivery_driver.surname}` : null,
            order.order_picker ? `${order.order_picker.name} ${order.order_picker.surname}` : null
        ]).filter(Boolean) // Убираем `null`
        )
    ];

    // Фильтрация заказов
    const filteredOrders = orders.filter(order => {
        return (
        (selectedStore === '' || order.store.address === selectedStore) &&
        (selectedState === '' || order.state === selectedState) &&
        (selectedEmployee === '' ||
            (order.delivery_driver && `${order.delivery_driver.name} ${order.delivery_driver.surname}` === selectedEmployee) ||
            (order.order_picker && `${order.order_picker.name} ${order.order_picker.surname}` === selectedEmployee))
        );
    });

    const isDeliveryExpired = (deliveryDate, status) => {
        if (status.trim().toLowerCase() !== 'delivered') {
            const currentDate = new Date();
            const orderDate = new Date(deliveryDate);
            return orderDate < currentDate;
        }
        else return false;
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='order-list'>
        <button onClick={() => navigate(-1)} className="back-button">Назад</button>
        <div className="list-container">
            <h2>Список заказов</h2>

            {/* Фильтры */}
            <div className="filters">
            <label>
                Магазин: 
                <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
                <option value="">Все</option>
                {uniqueStores.map((store, index) => (
                    <option key={index} value={store}>{store}</option>
                ))}
                </select>
            </label>

            <label>
                Статус заказа:
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                <option value="">Все</option>
                {uniqueStates.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                ))}
                </select>
            </label>

            <label>
                Сотрудник:
                <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
                <option value="">Все</option>
                {uniqueEmployees.map((employee, index) => (
                    <option key={index} value={employee}>{employee}</option>
                ))}
                </select>
            </label>
            </div>

            {/* Список заказов */}
            <ul className="list">
            {filteredOrders.map((order) => (
                <li key={order.id} className={`list-item ${isDeliveryExpired(order.delivery_date, order.state) ? 'expired' : ''}`}>
                <p><strong>Заказ #{order.id}</strong></p>
                <p><strong>Магазин/склад:</strong> {order.store.address}</p>
                <p><strong>Клиент:</strong> {order.client.name}</p>
                <p><strong>Адрес доставки:</strong> {order.delivery_address}</p>
                <p><strong>Дата доставки:</strong> {order.delivery_date}</p>
                <p><strong>Комментарий:</strong> {order.comment || "Нет комментариев"}</p>
                <p><strong>Статус:</strong> {order.state}</p>
                <p><strong>Сумма:</strong> {order.total_price}₽</p>

                <p><strong>Товары:</strong></p>
                <ul>
                    {order.order_items.map((item, index) => (
                    <li key={index}>
                        {item.product.name} — {item.amount} шт.
                        {item.product.brand && ` (Бренд: ${item.product.brand})`}
                    </li>
                    ))}
                </ul>

                {order.delivery_driver? (
                    <p><strong>Курьер:</strong> {order.delivery_driver.name} {order.delivery_driver.surname}</p>
                ) : (<p><strong style={{marginRight: '10px'}}>Курьер не выбран</strong> 
                    {
                        user_position === 'курьер' && (
                            <button className="list-button" onClick={() => AddDeliveryDriver(order.id, user_info.id)}>Взять заказ</button>
                        )
                    }</p>)}
                {order.order_picker? (
                    <p><strong>Сборщик:</strong> {order.order_picker.name} {order.order_picker.surname}</p>
                ) : (<p><strong style={{marginRight: '10px'}}>Сборщик не выбран</strong> 
                    {
                        user_position === 'сборщик' && (
                            <button className="list-button" onClick={() => AddOrderPicker(order.id, user_info.id)}>Взять заказ</button>
                        )
                    }</p>)}
                {
                    (user_info.id === (order.order_picker ? order.order_picker.id : null) || 
                    user_info.id === (order.delivery_driver ? order.delivery_driver.id : null))
                    // || (!order.order_picker && user_position === 'сборщик') || (!order.delivery_driver && user_position === 'курьер')) 
                    &&
                    (<p style={{textAlign: 'center'}}><button className="list-button" 
                        onClick={() => navigate(`/orders/${order.id}/alter`)} 
                        state={{ from: window.location.pathname }}>Изменить заказ</button>
                    </p>)
                }
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
};

export default OrderList;

