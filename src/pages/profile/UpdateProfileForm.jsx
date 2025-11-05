// src/pages/profile/UpdateProfileForm.jsx
import React from "react";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/common/input";
import Button from "../../components/common/button";

const UpdateProfileForm = () => {
  const { user } = useAuthStore(); // Ambil data user dari Zustand

  return (
    <div>
      <div
        className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500"
        role="alert"
      >
        <p className="font-bold">Info</p>
        <p>
          API untuk update profil tidak tersedia. Form di bawah ini hanya
          sebagai contoh tampilan.
        </p>
      </div>
      <form className="space-y-4">
        {/* Gunakan 'defaultValue' untuk menampilkan data awal */}
        <Input
          id="name"
          label="Nama Lengkap"
          type="text"
          defaultValue={user?.name || ""}
          disabled // Buat input tidak bisa diubah
        />
        <Input
          id="phone"
          label="Nomor Telepon"
          type="text"
          defaultValue={user?.phone || ""}
          disabled
        />
        <Input
          id="email"
          label="Email"
          type="email"
          defaultValue={user?.email || ""}
          disabled
        />
        <Input
          id="address"
          label="Alamat"
          type="text"
          defaultValue={user?.address || ""}
          disabled
        />
        <div className="pt-2">
          <Button type="submit" disabled>
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
