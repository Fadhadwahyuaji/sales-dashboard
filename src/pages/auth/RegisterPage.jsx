import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react";

import { registerSchema } from "../../utils/schemas";
import { registerAPI } from "../../api/auth";

import Input from "../../components/common/input";
import Button from "../../components/common/button";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAPI(data);
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Registrasi gagal. Periksa kembali data Anda."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
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
              Bergabunglah
              <br />
              Bersama Kami
            </h2>
            <p className="text-blue-100 text-lg">
              Mulai kelola bisnis Anda dengan lebih efisien dan terorganisir.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              "Manajemen customer yang mudah",
              "Tracking transaksi real-time",
              "Dashboard analytics powerful",
              "Support 24/7",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-sm">
          Sudah memiliki lebih dari 1000+ pengguna aktif
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-xl">
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
                Buat Akun Baru 🚀
              </h2>
              <p className="text-gray-600">
                Isi form di bawah untuk membuat akun Anda
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="name"
                  label="Nama Lengkap"
                  type="text"
                  placeholder="John Doe"
                  icon={<User className="w-5 h-5 text-gray-400" />}
                  {...register("name")}
                  error={errors.name}
                />

                <Input
                  id="phone"
                  label="Nomor Telepon"
                  type="text"
                  placeholder="081234567890"
                  icon={<Phone className="w-5 h-5 text-gray-400" />}
                  {...register("phone")}
                  error={errors.phone}
                />
              </div>

              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                {...register("email")}
                error={errors.email}
              />

              <Input
                id="address"
                label="Alamat"
                type="text"
                placeholder="Jl. Contoh No. 123"
                icon={<MapPin className="w-5 h-5 text-gray-400" />}
                {...register("address")}
                error={errors.address}
              />

              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Minimal 8 karakter"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                {...register("password")}
                error={errors.password}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  Persyaratan Password:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Minimal 8 karakter</li>
                  <li>• Kombinasi huruf dan angka</li>
                  <li>• Mengandung karakter spesial (!@#$%^&*)</li>
                </ul>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Saya setuju dengan{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    syarat dan ketentuan
                  </Link>{" "}
                  yang berlaku
                </label>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
                size="lg"
              >
                {!isSubmitting && <UserPlus className="w-5 h-5" />}
                {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login di sini
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

export default RegisterPage;
