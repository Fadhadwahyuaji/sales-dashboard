// src/api/summary.js
import api from "./axiosInstance";
import { format } from "date-fns";

// Helper untuk mendapatkan tanggal hari ini
const today = format(new Date(), "yyyy-MM-dd");

// Daily transactions
export const getDailySummaryAPI = (params) => {
  // Default params jika tidak disediakan
  const defaultParams = {
    startDate: today,
    endDate: today,
  };
  return api.get("/summaries/daily-transactions", {
    params: { ...defaultParams, ...params },
  });
};

// Monthly transactions
export const getMonthlySummaryAPI = (params) => {
  const defaultParams = {
    startMonth: format(new Date(), "yyyy-MM"),
    endMonth: format(new Date(), "yyyy-MM"),
  };
  return api.get("/summaries/monthly-transactions", {
    params: { ...defaultParams, ...params },
  });
};

// Yearly transactions
export const getYearlySummaryAPI = (params) => {
  const defaultParams = {
    year: format(new Date(), "yyyy"),
  };
  return api.get("/summaries/yearly-transactions", {
    params: { ...defaultParams, ...params },
  });
};

// Top customers
export const getTopCustomersAPI = (params) => {
  const defaultParams = {
    startDate: today,
    endDate: today,
    limit: 5, // Ambil top 5
  };
  return api.get("/summaries/top-customers", {
    params: { ...defaultParams, ...params },
  });
};
