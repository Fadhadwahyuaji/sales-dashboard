// src/utils/schemas.js
import { z } from "zod";

export const loginSchema = z.object({
  // Validasi berdasarkan API Spec
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

// Validasi berdasarkan API Spec
export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid"),
  address: z.string().min(1, "Alamat wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(6, "Password baru minimal 6 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, kecil, dan angka"
      ),
    newPasswordConfirmation: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["newPasswordConfirmation"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Password baru harus berbeda dengan password saat ini",
    path: ["newPassword"],
  });
