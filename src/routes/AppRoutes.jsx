// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";

// --- Komponen Helper ---

// 1. Guest Route (Hanya untuk yang belum login)
const GuestRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};

// 2. Protected Route (Hanya untuk yang sudah login)
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// --- Konfigurasi Rute Utama ---

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rute untuk Tamu (Guest) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Route>

      {/* Rute Terproteksi (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Route>

      {/* Halaman 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
