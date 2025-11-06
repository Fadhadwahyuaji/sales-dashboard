import api from "./axiosInstance";

// API Spec: POST /auth/login
export const loginAPI = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// API Spec: GET /auth/profile
export const getProfileAPI = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// API Spec: POST /auth/register
export const registerAPI = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// API Spec: PUT /auth/password
export const updatePasswordAPI = async (data) => {
  const payload = {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    newPasswordConfirmation: data.newPasswordConfirmation,
  };

  const response = await api.put("/auth/password", payload, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};
