import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from "./components/login page/Auth";
import MainPage from './components/main page/MainPage';
import StoreList from './components/StoreList';
import EmployeeList from './components/EmployeeList';
import ProductList from './components/ProductList';
import OrderList from './components/orders management/OrderList';
import OrderAlter from './components/orders management/OrderAlter';
import Report from './components/report page/Report';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/main-page" element={<MainPage />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/stores" element={<StoreList />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orders/:id/alter" element={<OrderAlter />} />
    </Routes>
  </BrowserRouter>
  );
}
export default App;
