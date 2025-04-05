import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetOrderById, UpdateOrderItem, UpdateOrder } from '../../API';
import './order-alter.css';

const OrderAlter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    const user_position = user_info.position_data.name.trim().toLowerCase();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [editedItems, setEditedItems] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await GetOrderById(id);
                setOrder(response.data);
                setNewStatus(response.data.state);
                console.log(response.data.delivery_driver?.id)
            } catch (err) {
                setError('Ошибка загрузки заказа');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, refreshTrigger]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    // Проверка, имеет ли пользователь право изменять заказ
    const isAuthorized = (user_info.id === order.order_picker?.id) || (user_info.id === order.delivery_driver?.id);
    if (!isAuthorized) {
        return <p>У вас нет прав для редактирования этого заказа.</p>;
    }

    // Изменение статуса заказа
    const handleStatusChange = async () => {
        try {
            await UpdateOrder(id, { state: newStatus });
            alert('Статус обновлён!');
        } catch (err) {
            console.error('Ошибка обновления статуса:', err);
        }
    };

    // Обновление количества товара
    const handleItemChange = async (itemId) => {
        const itemData = editedItems[itemId];
        if (!itemData || !itemData.amount || !itemData.comment) {
            alert('Заполните все поля!');
            return;
        }

        try {
            await UpdateOrderItem(itemId, {
                amount: itemData.amount,
                comment: itemData.comment,
                changed_by_id: user_info.id
            });
            alert('Количество товара обновлено!');
            setRefreshTrigger(prev => !prev);
        } catch (err) {
            console.error('Ошибка обновления товара:', err);
        }
    };

    return (
        <div className="order-edit-container">
            <button onClick={() => navigate(-1)} className="back-button">Назад</button>
            <h2>Редактирование заказа #{order.id}</h2>

            <div className="order-edit-section">
                <label>Изменить статус:</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="new">Новый</option>
                    <option value="packed">Собран</option>
                    <option value="delivered">Доставлен</option>
                </select>
                <button className="save-button" onClick={handleStatusChange}>Сохранить статус</button>
            </div>
            { user_position === 'сборщик' && ( <>
            <h3>Изменение количества товаров</h3>
            {order.order_items.map((item) => (
                <div key={item.id} className="order-item">
                    <p>{item.product.name} — <strong>{item.amount} шт.</strong></p>
                    <input
                        type="number"
                        min="1"
                        placeholder="Новое кол-во"
                        onChange={(e) => setEditedItems({ 
                            ...editedItems, 
                            [item.id]: { 
                                ...editedItems[item.id], 
                                amount: e.target.value 
                            } 
                        })}
                    />
                    <input
                        type="text"
                        placeholder="Комментарий"
                        onChange={(e) => setEditedItems({ 
                            ...editedItems, 
                            [item.id]: { 
                                ...editedItems[item.id], 
                                comment: e.target.value 
                            } 
                        })}
                    />
                    <button className="save-button" onClick={() => handleItemChange(item.id)}>Сохранить</button>
                </div>
            ))}
        </>)}
        </div>
    );
};

export default OrderAlter;