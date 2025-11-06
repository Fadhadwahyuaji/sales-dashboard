import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import { updatePasswordSchema } from "../../utils/schemas";
import { updatePasswordAPI, getProfileAPI } from "../../api/auth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

import Input from "../../components/common/input";
import Button from "../../components/common/button";

// Komponen helper untuk menampilkan info (agar lebih rapi)
const ProfileInfoItem = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value || "-"}
    </dd>
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
      const response = await updatePasswordAPI(data);

      toast.success(
        response?.responseMessage ||
          "Password berhasil diupdate. Silakan login kembali."
      );

      reset();

      // Delay sebentar sebelum logout agar user bisa baca toast
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Update password failed:", error);

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
        placeholder="Masukkan password saat ini"
        {...register("currentPassword")}
        error={errors.currentPassword}
      />
      <Input
        id="newPassword"
        label="Password Baru"
        type="password"
        placeholder="Minimal 8 karakter"
        {...register("newPassword")}
        error={errors.newPassword}
      />
      <Input
        id="newPasswordConfirmation"
        label="Konfirmasi Password Baru"
        type="password"
        placeholder="Masukkan ulang password baru"
        {...register("newPasswordConfirmation")}
        error={errors.newPasswordConfirmation}
      />
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          <Lock className="w-4 h-4 mr-2" />
          Update Password
        </Button>
      </div>
    </form>
  );
};

// Komponen Halaman Utama
const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil user dari Zustand dan setUser untuk update
  const { user: profile, setUser } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfileAPI();

        // Sesuaikan dengan struktur response API
        const profileData = response?.data ?? response;

        // Update Zustand store dengan data terbaru
        setUser(profileData);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(
          err?.response?.data?.responseMessage ||
            err?.response?.data?.message ||
            "Gagal memuat data profil."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!profile) {
    return <ErrorMessage message="Data profil tidak ditemukan." />;
  }

  return (
    <div className="space-y-6">
      {/* Header dengan Foto Profil */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-12">
            <div className="flex-shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 w-fit">
                  {profile.roleName || profile.role_name || "User"}
                </span>
                <span className="text-sm text-gray-500">
                  Kode: {profile.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout untuk Desktop, Stack untuk Mobile */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom 1: Informasi Profil (Read-only) */}
        <div className="bg-white rounded-lg shadow-sm lg:col-span-1">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Profil
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Data pribadi Anda yang terdaftar di sistem.
            </p>
            <dl className="mt-6 divide-y divide-gray-200">
              <ProfileInfoItem label="Kode" value={profile.code} />
              <ProfileInfoItem label="Nama Lengkap" value={profile.name} />
              <ProfileInfoItem label="Email" value={profile.email} />
              <ProfileInfoItem label="Nomor Telepon" value={profile.phone} />
              <ProfileInfoItem
                label="Role"
                value={profile.roleName || profile.role_name}
              />
              <ProfileInfoItem
                label="Kode Role"
                value={profile.roleCode || profile.role_code}
              />
            </dl>
          </div>
        </div>

        {/* Kolom 2: Update Password */}
        <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              Update Password
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Ubah password Anda secara berkala untuk menjaga keamanan akun.
            </p>

            {/* Info Box */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-900">
                Persyaratan Password:
              </h4>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Minimal 8 karakter</li>
                <li>Kombinasi huruf besar dan kecil</li>
                <li>Mengandung angka</li>
                <li>Mengandung karakter spesial (!@#$%^&*)</li>
              </ul>
            </div>

            <div className="mt-6">
              <UpdatePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
