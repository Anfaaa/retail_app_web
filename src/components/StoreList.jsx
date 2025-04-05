import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetStores } from '../API';
import '../styles/list-page.css';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user_info');
    if (!user) {
      navigate('/');
    } else {
      const GetStoresList = async () => {
        try {
          const response = await GetStores();
          setStores(response.data);
        } catch (err) {
          setError('Ошибка загрузки магазинов');
        } finally {
          setLoading(false);
        }
      };
      GetStoresList();
    }
  }, [navigate]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
        <button onClick={() => navigate(-1)} className="back-button">Назад</button>
        <div className="list-container">
            <h2>Магазины и склады</h2>
            <ul className="list">
                {stores.map((store) => (
                <li key={store.code} className="list-item">
                    <p><strong>{store.address}</strong></p>
                    <p>{store.is_main ? 'Главный склад' : store.is_store ? 'Магазин' : 'Склад'}</p>
                </li>
                ))}
            </ul>
        </div>
    </>
  );
};

export default StoreList;
