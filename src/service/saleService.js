// services/saleService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/sale";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product CRUD
export const createProduct = (data) => {
  return axios.post(`${API_URL}/products`, data, {
    headers: { "Content-Type": "application/json" }
  });
};

export const updateProduct = (productId, data) => {
  return axios.put(`${API_URL}/products/${productId}`, data, {
    headers: { "Content-Type": "application/json" }
  });
};

export const getProduct = (productId) => {
  return axios.get(`${API_URL}/products/${productId}`);
};

export const getProducts = (params) => {
  return axios.get(`${API_URL}/products`, { params });
};

export const deleteProduct = (productId) => {
  return axios.delete(`${API_URL}/products/${productId}`);
};

// Image Management
export const uploadSingleImage = (productId, file, isMain) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("isMain", isMain);

  return axios.post(
    `${API_URL}/${productId}/images`,
    formData
  );
};


export const uploadMultipleImages = (productId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return axios.post(
    `${API_URL}/${productId}/images/batch`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
};

export const getProductImages = (productId) => {
  return axios.get(`${API_URL}/${productId}/images`);
};

export const deleteProductImage = (imageId) => {
  return axios.delete(`${API_URL}/images/${imageId}`);
};
// Export PDF
export const exportProductPdf = () => {
  return axios.get(`${API_URL}/products/export-pdf`, {
    responseType: 'blob'
  });
};