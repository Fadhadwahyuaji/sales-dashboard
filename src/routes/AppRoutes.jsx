// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProfilePage from "../pages/profile/ProfilePage";
import SummaryPage from "../pages/summary/SummaryPage";
import CustomerListPage from "../pages/customer/CustomerListPage";
import AddCustomerPage from "../pages/customer/AddCustomerPage";
import EditCustomerPage from "../pages/customer/EditCustomerPage";
import CustomerDetailPage from "../pages/customer/CustomerDetailPage";
import TransactionListPage from "../pages/transaction/TransactionListPage";
import TransactionDetailPage from "../pages/transaction/TransactionDetailPage";

// --- Komponen Helper ---

// 1. Guest Route (Hanya untuk yang belum login)
const GuestRoute = () => {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  if (!hasHydrated) return null; // atau spinner

  return !(isAuthenticated || !!token) ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" />
  );
};

// 2. Protected Route (Hanya untuk yang sudah login)
const ProtectedRoute = () => {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  if (!hasHydrated) return null; // cegah redirect sebelum rehydrate

  return isAuthenticated || !!token ? <Outlet /> : <Navigate to="/login" />;
};

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
          <Route path="/customers/:code" element={<CustomerDetailPage />} />
          <Route path="/customers/add" element={<AddCustomerPage />} />
          <Route path="/customers/edit/:code" element={<EditCustomerPage />} />
          <Route path="/transactions" element={<TransactionListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/transactions" element={<TransactionListPage />} />
          <Route
            path="/transactions/:referenceNo"
            element={<TransactionDetailPage />}
          />
        </Route>
      </Route>

      {/* Halaman 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
