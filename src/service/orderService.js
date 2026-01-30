// services/orderService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";
const API_URL_SALE = "http://localhost:8080/api/sale";
const API_URL_CUSTOMER = "http://localhost:8080/api/user";
// Get auth header with token
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};


export const createOrder = (orderData) => {
    return axios.post(`${API_URL}/create`, orderData, getAuthHeader());
};


export const getOrderById = (orderId) => {
    return axios.get(`${API_URL_CUSTOMER}/my-order-detail`, {
        params: { orderId },
        ...getAuthHeader()
    });
};


export const getMyOrders = () => {
    return axios.get(`${API_URL}/my-orders`, getAuthHeader());
};


export const getAllOrdersForSale = (params) => {
    return axios.get(`${API_URL_SALE}/orders-list`, {
        params,
        ...getAuthHeader()
    });
};


export const updateOrderStatus = (orderId, status) => {
    return axios.put(`${API_URL}/${orderId}/status`,
        { status },
        getAuthHeader()
    );
};


export const getOrderDetailForSale = (orderId) => {
    return axios.get(`${API_URL_SALE}/order-detail`, {
        params: { orderId },
        ...getAuthHeader()
    });
};


export const updateOrderStatusForSale = (orderId, status) => {
    return axios.put(`${API_URL_SALE}/order-status`, null, {
        params: { orderId, status },
        ...getAuthHeader()
    });
};

