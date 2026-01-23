// services/cartService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

// Get auth header with token
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Fetch current user's cart
export const getCart = () => {
    return axios.get(`${API_URL}/me`, getAuthHeader());
};

// Add product to cart
export const addToCart = (productId, quantity = 1) => {
    return axios.post(`${API_URL}/add?productId=${productId}&quantity=${quantity}`, null, getAuthHeader());
};

// Update cart item quantity
export const updateCartItem = (productId, quantity) => {
    return axios.put(`${API_URL}/update?productId=${productId}&quantity=${quantity}`, null, getAuthHeader());
};

// Remove item from cart
export const removeFromCart = (productId) => {
    return axios.delete(`${API_URL}/remove?productId=${productId}`, getAuthHeader());
};

// Clear entire cart
export const clearCart = () => {
    return axios.delete(`${API_URL}/clear`, getAuthHeader());
};
