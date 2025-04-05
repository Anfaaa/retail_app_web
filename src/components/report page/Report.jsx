import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetOrders } from '../../API';
import './report.css'

const Report = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await GetOrders();
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке заказов', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Фильтрация заказов по дате и статусу
    const filterOrders = () => {
        const filtered = orders.filter(order => {
            const orderDate = new Date(order.delivery_date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return (
                (startDate === '' || orderDate >= start) &&
                (endDate === '' || orderDate <= end) &&
                (order.state === 'delivered' || order.state === 'packed')
            );
        });
        setFilteredOrders(filtered);
    };

    // Считаем количество собранных и доставленных заказов
    const countOrders = () => {
        let deliveredCount = 0;
        let pickedUpCount = 0;
        
        filteredOrders.forEach(order => {
            if (order.state === 'delivered') {
                deliveredCount++;
            } else if (order.state === 'packed') {
                pickedUpCount++;
            }
        });
        
        return { deliveredCount, pickedUpCount };
    };

    const { deliveredCount, pickedUpCount } = countOrders();

    return (
        <div className="report-container">
            <button onClick={() => navigate(-1)} className="back-button">Назад</button>
            <h2>Отчет о заказах</h2>

            {loading ? <p>Загрузка...</p> : (
                <>
                    <div className="filters">
                        <label>
                            Выберите дату начала:
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Выберите дату окончания:
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </label>
                        <button onClick={filterOrders}>Применить фильтр</button>
                    </div>

                    <div className="report">
                        <h3>Количество заказов</h3>
                        <p><strong>Доставлено: </strong>{deliveredCount}</p>
                        <p><strong>Собрано: </strong>{pickedUpCount}</p>
                    </div>

                    <div className="report-order-list">
                        <h3>Список заказов</h3>
                        <ul>
                            {filteredOrders.map((order) => (
                                <li key={order.id}>
                                    <p><strong>Заказ #{order.id}</strong></p>
                                    <p><strong>Статус:</strong> {order.state}</p>
                                    <p><strong>Дата доставки:</strong> {order.delivery_date}</p>
                                    <p><strong>Клиент:</strong> {order.client.name}</p>
                                    <p><strong>Магазин:</strong> {order.store.address}</p>
                                    <p><strong>Доставлено курьером:</strong> {order.delivery_driver ? `${order.delivery_driver.name} ${order.delivery_driver.surname}` : 'Не доставлен'}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default Report;
