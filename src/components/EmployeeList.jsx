import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetEmployees,  GetStores, GetPositions, AddEmployee } from '../API'; // Добавим функцию AddEmployee для отправки данных на сервер
import '../styles/list-page.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    surname: '',
    name: '',
    middle_name: '',
    position: '',
    location: '',
  });
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [createFormVisible, setCreateFormVisible] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user_info');
    if (!user) {
      navigate('/');
    } else {
      const fetchData = async () => {
        try {
          // Загружаем сотрудников, места и должности
          const [employeesResponse, locationsResponse, positionsResponse] = await Promise.all([
            GetEmployees(),
            GetStores(),
            GetPositions(),
          ]);
          setEmployees(employeesResponse.data);
          setLocations(locationsResponse.data);
          setPositions(positionsResponse.data);
        } catch (err) {
          setError('Ошибка загрузки данных');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [navigate, refreshTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddEmployee(newEmployee);
      setEmployees((prev) => [...prev, newEmployee]);
      setNewEmployee({ surname: '', name: '', middle_name: '', position: '', location: '' });
      setCreateFormVisible(false)
      setRefreshTrigger(prev => !prev);
    } catch (err) {
      setError('Ошибка при добавлении сотрудника');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <button onClick={() => navigate(-1)} className="back-button">Назад</button>
      <div className="list-container">
        <h2>Сотрудники</h2>
        <button onClick={() => setCreateFormVisible(true)} className="add-button">Добавить нового сотрудника</button>

        {/* Форма для добавления сотрудника */}
        {createFormVisible && (
        <form onSubmit={handleSubmit} className="add-employee-form">
          <h3>Добавить сотрудника</h3>
          <div className="form-field">
            <label htmlFor="surname">Фамилия:</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={newEmployee.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="middle_name">Отчество:</label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              value={newEmployee.middle_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="position">Должность:</label>
            <select
                id="position"
                name="position"
                value={newEmployee.position}
                onChange={handleChange}
                required
                >
                <option value="">Выберите должность</option>
                {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                    {position.name}
                    </option>
                ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="location">Место работы:</label>
            <select
              id="location"
              name="location"
              value={newEmployee.location}
              onChange={handleChange}
              required
            >
              <option value="">Выберите место работы</option>
              {locations.map((location) => (
                <option key={location.code} value={location.code}>
                  {location.address}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="add-button">Добавить</button>
        </form>
        )}
        {/* Список сотрудников */}
        <ul className="list">
          {employees.map((employee) => (
            <li key={employee.id} className="list-item">
              <p><strong>{employee.surname} {employee.name} {employee.middle_name}</strong></p>
              <p>Должность: {employee.position_data?.name || 'Не указана'}</p>
              <p>Место работы: {employee.location_data?.address || 'Не указано'}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EmployeeList;