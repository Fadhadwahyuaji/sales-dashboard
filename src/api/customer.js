// src/api/customer.js
import api from "./axiosInstance";

// === CUSTOMER API ===

// GET /api/v1/customers (dengan pagination & filter) [cite: 60]
export const getCustomersAPI = (params) => {
  const page = params.page || 1;
  const perPage = params.perPage || 10;

  const apiParams = {
    // untuk backend yang mendukung page/perPage
    page,
    perPage,
    // fallback kompatibilitas: backend yang butuh limit/offset
    limit: perPage,
    offset: (page - 1) * perPage,
  };

  if (params.search && params.search.trim()) {
    apiParams.search = params.search.trim();
  }

  return api.get("/customers/list", { params: apiParams });
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
