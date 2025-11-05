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
