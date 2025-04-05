import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import { GetUser } from '../../API';

const Auth = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (code === '')
      setError('Пожалуйста, введите код');
    else {
      setError('');
      try {
          const response = await GetUser(code);
          console.log('Получены данные пользователя:', response.data);
          localStorage.setItem('user_info', JSON.stringify(response.data));
          navigate('/main-page');
      } catch (error) {
          console.error('Ошибка при получении данных:', error);
          setError('Ошибка входа');
      }
    };
  }

  return (
    <div className="auth-container">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="code">Введите код</label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Код"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" className="auth-button">Войти</button>
      </form>
    </div>
  );
};

export default Auth;