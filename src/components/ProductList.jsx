import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetProducts, UpdateProduct } from '../API';
import '../styles/list-page.css';
import '../styles/file-upload.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCode, setSelectedCode] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user_info');
    if (!user) {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await GetProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedCode || !file) {
      alert('Выберите код товара и загрузите файл');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      await UpdateProduct(selectedCode, formData);
      alert('Изображение успешно загружено');
      fetchProducts();
    } catch (err) {
      alert('Ошибка загрузки изображения');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <button onClick={() => navigate(-1)} className="back-button lower">Назад</button>
      <div className="upload-container">
        <h3>Загрузить изображение для товара</h3>
        <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)}>
          <option value="">Выберите код товара</option>
          {products.map((product) => (
            <option key={product.code} value={product.code}>
              {product.code} - {product.name}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Загрузить</button>
      </div>
      <div className="list-container">
        <h2>Список всех товаров</h2>
        <ul className="list">
          {products.map((product) => (
            <li key={product.code} className="list-item">
              <p><strong>{product.name} {product?.brand ? `(${product.brand})` : ''}</strong></p>
              <p>Код товара: {product.code}</p>
              {product.image && (
                <img src={product.image} alt={product.name} className="product-image" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProductList;

