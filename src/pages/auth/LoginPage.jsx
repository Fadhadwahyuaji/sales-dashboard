import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Phone, Lock, LayoutDashboard } from "lucide-react";

import { loginSchema } from "../../utils/schemas";
import { loginAPI, getProfileAPI } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

import Input from "../../components/common/input";
import Button from "../../components/common/button";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken, setUser, logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const loginResponse = await loginAPI(data);
      console.log("Login response:", loginResponse);

      const token = loginResponse.accessToken;

      if (!token) {
        throw new Error("Token not found in response");
      }

      setToken(token);

      const profileResponse = await getProfileAPI();
      const user = profileResponse?.data ?? profileResponse;

      setUser(user);

      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      logout();
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Login gagal. Cek kembali data Anda."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Sales Dashboard</h1>
          </div>

          <div className="mt-16 space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Kelola Bisnis Anda
              <br />
              Dengan Lebih Mudah
            </h2>
            <p className="text-blue-100 text-lg">
              Sistem manajemen penjualan yang powerful untuk membantu bisnis
              Anda berkembang lebih cepat.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm text-blue-200 mt-1">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5000+</div>
              <div className="text-sm text-blue-200 mt-1">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-sm text-blue-200 mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
              <LayoutDashboard className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Selamat Datang! 👋
              </h2>
              <p className="text-gray-600">
                Silakan login untuk melanjutkan ke dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                id="phone"
                label="Nomor Telepon"
                type="text"
                placeholder="Contoh: 081234567890"
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                {...register("phone")}
                error={errors.phone}
              />

              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Masukkan password Anda"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                {...register("password")}
                error={errors.password}
              />

              {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Ingat saya</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lupa password?
                </Link>
              </div> */}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
                size="lg"
              >
                {!isSubmitting && <LogIn className="w-5 h-5" />}
                {isSubmitting ? "Memproses..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            © 2025 Sales Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
