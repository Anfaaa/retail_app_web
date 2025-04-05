import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export const GetUser = (code) => {
    return api.get(`employees/${code}/`);
}

export const GetStores = () => {
    return api.get(`locations/`);
}

export const GetEmployees = () => {
    return api.get(`employees/`);
}

export const GetPositions = () => {
    return api.get(`employees-positions/`);
}

export const AddEmployee = async (employeeData) => {
    const response = await api.post('employees/', employeeData);
    return response.data;
};

 export const GetProducts = () => {
    return api.get(`products/`);
}

export const GetOrders = () => {
    return api.get(`orders/`);
}

export const UpdateOrder = (order_id, update_info) => {
    return api.patch(`orders/${order_id}/`, update_info);
}

export const UpdateOrderItem = (order_product_id, update_info) => {
    return api.patch(`order-products/${order_product_id}/`, update_info);
}

export const GetOrderById = (order_id) => {
    return api.get(`orders/${order_id}/`);
}


export const UpdateProduct = (product_code, update_info) => {
    return api.patch(`products/${product_code}/`, update_info);
}