// src/pages/profile/ProfilePage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/authStore";
import { updatePasswordSchema } from "../../utils/schemas";
import { updatePasswordAPI } from "../../api/auth";

import Input from "../../components/common/input";
import Button from "../../components/common/button";

// Komponen helper untuk menampilkan info (agar lebih rapi)
const ProfileInfoItem = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value || "-"}</dd>
  </div>
);

// Komponen Form Update Password
const UpdatePasswordForm = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      console.log("Data yang akan dikirim:", data);

      await updatePasswordAPI(data);
      toast.success("Password berhasil diupdate. Silakan login kembali.");
      reset();
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Update password failed:", error);

      // Debug: log detail error dari server
      if (error.response?.data) {
        console.log("Server error response:", error.response.data);
      }

      // Handle validation errors lebih spesifik
      let errorMessage = "Update password gagal.";

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.errors && typeof errorData.errors === "object") {
          // Tampilkan semua validation errors
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const messageList = Array.isArray(messages)
                ? messages
                : [messages];
              return `${field}: ${messageList.join(", ")}`;
            })
            .join("\n");

          errorMessage = errorMessages;
        } else if (errorData.responseMessage) {
          errorMessage = errorData.responseMessage;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="currentPassword"
        label="Password Saat Ini"
        type="password"
        {...register("currentPassword")}
        error={errors.currentPassword}
      />
      <Input
        id="newPassword"
        label="Password Baru"
        type="password"
        {...register("newPassword")}
        error={errors.newPassword}
      />
      <Input
        id="newPasswordConfirmation"
        label="Konfirmasi Password Baru"
        type="password"
        {...register("newPasswordConfirmation")}
        error={errors.newPasswordConfirmation}
      />
      <div className="pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  );
};

// Komponen Halaman Utama
const ProfilePage = () => {
  // Ambil data user yang sedang login dari Zustand
  const { user } = useAuthStore();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Kolom 1: Informasi Profil (Read-only) */}
      <div className="p-6 bg-white rounded-lg shadow-sm lg:col-span-1">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          Informasi Profil
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Data pribadi Anda yang terdaftar di sistem.
        </p>
        <dl className="mt-6 space-y-4">
          <ProfileInfoItem label="Nama Lengkap" value={user?.name} />
          <ProfileInfoItem label="Email" value={user?.email} />
          <ProfileInfoItem label="Nomor Telepon" value={user?.phone} />
          <ProfileInfoItem label="Alamat" value={user?.address} />
        </dl>
      </div>

      {/* Kolom 2: Update Password */}
      <div className="p-6 bg-white rounded-lg shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          Update Password
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Ubah password Anda secara berkala untuk menjaga keamanan akun.
        </p>
        <div className="mt-6">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
