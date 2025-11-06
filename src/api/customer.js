// src/api/customer.js
import api from "./axiosInstance";

// === CUSTOMER API ===

// GET /api/v1/customers (dengan pagination & filter)
export const getCustomersAPI = (params) => {
  const queryParams = {};

  // Pagination
  if (params.page) {
    queryParams.page = params.page;
  }
  if (params.perPage) {
    queryParams.perPage = params.perPage;
  }

  // Search
  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  return api.get("/customers/list", { params: queryParams });
};

// GET /customers/{code}
export const getCustomerDetailAPI = (code) => {
  return api.get(`/customers/${code}`);
};

// POST /customers
export const createCustomerAPI = (data) => {
  return api.post("/customers", data);
};

// PUT /customers/{code}
export const updateCustomerAPI = (code, data) => {
  return api.put(`/customers/${code}`, data);
};

// === PROVINCE & CITY API ===
export const getProvincesAPI = () => {
  return api.get("/provinces/list");
};

export const getCitiesAPI = (provinceCode) => {
  const params = {};
  if (provinceCode) params.provinceCode = provinceCode;
  return api.get("/cities/list", { params });
};
