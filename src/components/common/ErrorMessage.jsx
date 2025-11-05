// src/components/common/ErrorMessage.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-10 text-red-600 bg-red-50 rounded-lg">
    <AlertTriangle className="w-12 h-12 mb-4" />
    <h3 className="text-lg font-semibold">Gagal Memuat Data</h3>
    <p className="text-sm">
      {message || "Terjadi kesalahan saat mengambil data."}
    </p>
  </div>
);

export default ErrorMessage;
