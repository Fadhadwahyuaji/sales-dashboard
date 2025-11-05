// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProfilePage from "../pages/profile/ProfilePage";

// --- Komponen Halaman Sederhana (Placeholder) ---
const SummaryPage = () => (
  <div className="p-4 bg-white rounded-lg shadow">Konten Halaman Summary</div>
);
const CustomerListPage = () => (
  <div className="p-4 bg-white rounded-lg shadow">Konten Halaman Customer</div>
);
const TransactionListPage = () => (
  <div className="p-4 bg-white rounded-lg shadow">
    Konten Halaman Transaction
  </div>
);

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

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<SummaryPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/transactions" element={<TransactionListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Halaman 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
