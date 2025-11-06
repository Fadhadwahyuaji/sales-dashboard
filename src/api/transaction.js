// src/api/transaction.js
import api from "./axiosInstance";

// GET /api/v1/transactions (dengan pagination & filter)
export const getTransactionsAPI = (params) => {
  return api.get("/transactions", { params });
};

// GET /api/v1/transactions/{referenceNo} (detail)
export const getTransactionDetailAPI = (referenceNo) => {
  return api.get(`/transactions/${referenceNo}`);
};
