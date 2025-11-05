import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginSchema } from "../../utils/schemas";
import { loginAPI, getProfileAPI } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

import Input from "../../components/common/input";
import Button from "../../components/common/button";

const LoginPage = () => {
  const navigate = useNavigate();
  // Ambil actions dari Zustand
  const { setToken, setUser, logout } = useAuthStore();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // isSubmitting untuk status loading
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Fungsi yang dijalankan saat form di-submit
  const onSubmit = async (data) => {
    try {
      // 1. Panggil API Login
      const loginResponse = await loginAPI(data);
      console.log("Login response:", loginResponse);

      const token = loginResponse.accessToken;

      if (!token) {
        throw new Error("Token not found in response");
      }

      // 2. Simpan token ke Zustand
      setToken(token);

      // 3. Panggil API Profile untuk dapat data user
      const profileResponse = await getProfileAPI();
      const user = profileResponse;

      // 4. Simpan data user ke Zustand (this will also set isAuthenticated to true)
      setUser(user);

      // 5. Beri notifikasi sukses dan arahkan ke dashboard
      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      // Reset authentication state on any error
      logout();
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Login gagal. Cek kembali data Anda."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Login ke Dashboard
        </h2>

        {/* handleSubmit dari react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="phone"
            label="Nomor Telepon"
            type="text"
            // 'register' akan menghubungkan input ini ke react-hook-form
            {...register("phone")}
            // Tampilkan error jika ada
            error={errors.phone}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Login
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
