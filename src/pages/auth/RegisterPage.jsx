import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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

  // Fungsi yang dijalankan saat form di-submit
  const onSubmit = async (data) => {
    try {
      // 'data' sudah tervalidasi oleh Zod
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
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Buat Akun Baru
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="name"
            label="Nama Lengkap"
            type="text"
            {...register("name")}
            error={errors.name}
          />
          <Input
            id="phone"
            label="Nomor Telepon"
            type="text"
            {...register("phone")}
            error={errors.phone}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email}
          />
          <Input
            id="address"
            label="Alamat"
            type="text"
            {...register("address")}
            error={errors.address}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Register
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
