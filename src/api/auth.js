import api from "./axiosInstance";

// API Spec: POST /auth/login
export const loginAPI = async (data) => {
  // Data = { phone, password }
  const response = await api.post("/auth/login", data);
  return response.data; // response.data akan berisi { token, user }
};

// API Spec: GET /auth/profile
export const getProfileAPI = async () => {
  const response = await api.get("/auth/profile");
  return response.data; // response.data akan berisi data user
};

// API Spec: POST /auth/register
export const registerAPI = async (data) => {
  // data akan berisi { name, phone, email, address, password }
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const updatePasswordAPI = async (data) => {
  console.log("Original data:", data);

  // Kirim field sesuai yang diterima backend (sesuai Postman)
  const payload = {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    newPasswordConfirmation: data.newPasswordConfirmation,
  };

  console.log("Formatted payload:", payload);

  try {
    const response = await api.put("/auth/password", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.log("API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    throw error;
  }
};
