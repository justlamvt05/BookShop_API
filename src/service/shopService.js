// services/shopService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

// Fetch products with pagination
export const getProductsPage = (page = 0, size = 9) => {
  return axios.get(API_URL, {
    params: { page, size }
  });
};

// Fetch products with filters
export const searchProducts = (filters = {}) => {
  const params = {
    page: filters.page || 0,
    size: filters.size || 9,
    ...(filters.name && { keyword: filters.name }),
    ...(filters.categoryName && { category: filters.categoryName }),
    ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
    ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
    ...(filters.sortBy && { sortBy: filters.sortBy })
  };
  return axios.get(API_URL, { params });
};
