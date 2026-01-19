// services/adminService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = (params) => {
  return axios.get(`${API_URL}/users`, { params });
};
export const getUserDetail = (userId) => {
  return axios.get(`${API_URL}/users/${userId}`);
};
export const toggleUser = (id) => {
  return axios.patch(`${API_URL}/users/${id}/toggle`);
};

export const exportUsers = () => {
  return axios.get("http://localhost:8080/api/admin/users/export", {
    responseType: "blob"
  });
};

export const updateUser = (id, data) => {
  return axios.put(`${API_URL}/users/${id}`, data);
};
export const createUser = (data) => {
  return axios.post(`${API_URL}/users`, data);
};

