import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_info');
    navigate('/');
  };

  return (
    <div className="main-page-container">
      <header className="main-page-header">
        <button onClick={handleLogout} className="logout-button">Выйти</button>
        {user && (
          <div className="user-info">
            <h2>{user.surname} {user.name} {user.middle_name}</h2>
            <p>Должность: {user.position_data.name}<br/>
            Место работы: {user.location_data.address}</p>
          </div>
        )}
      </header>
      <main className="main-content">
        <div className="grid-menu">
          <div className="menu-item" onClick={() => navigate('/orders')}>Заказы</div>
          <div className="menu-item" onClick={() => navigate('/products')}>Товары</div>
          <div className="menu-item" onClick={() => navigate('/stores')}>Магазины и склады</div>
          <div className="menu-item" onClick={() => navigate('/employees')}>Сотрудники</div>
          <div className="menu-item" onClick={() => navigate('/reports')}>Отчеты</div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;