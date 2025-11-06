// src/pages/customer/AddCustomerPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerForm from "./CustomerForm";
import { createCustomerAPI } from "../../api/customer";

const AddCustomerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCustomer = async (data) => {
    try {
      setIsLoading(true);

      // zod sudah uppercase-kan name; rapikan semua string
      const payload = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [
          k,
          typeof v === "string" ? v.trim() : v,
        ])
      );

      await createCustomerAPI(payload);
      toast.success("Customer baru berhasil ditambahkan!");
      navigate("/customers");
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const msg =
        (apiErrors && Object.values(apiErrors)[0]) ||
        error.response?.data?.message ||
        "Gagal menambah customer.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tambah Customer Baru
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Lengkapi formulir di bawah untuk menambahkan customer baru
        </p>
      </div>
      <CustomerForm onFormSubmit={handleCreateCustomer} isLoading={isLoading} />
    </div>
  );
};

export default AddCustomerPage;
