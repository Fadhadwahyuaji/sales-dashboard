// src/pages/customer/EditCustomerPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerForm from "./CustomerForm";
import { getCustomerDetailAPI, updateCustomerAPI } from "../../api/customer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const EditCustomerPage = () => {
  const navigate = useNavigate();
  const { code } = useParams(); // Ambil 'code' dari URL
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Ambil data customer yang mau di-edit
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsDataLoading(true);
        const res = await getCustomerDetailAPI(code);
        // Ambil payload dengan beberapa kemungkinan struktur
        const payload = res?.data?.data || res?.data?.item || res?.data || null;

        if (payload) {
          setCustomer(payload);
          setError(null);
        } else {
          setCustomer(null);
          setError("Data customer tidak ditemukan.");
        }
      } catch (e) {
        setCustomer(null);
        setError(e?.response?.data?.message || "Gagal memuat data customer.");
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchCustomer();
  }, [code]);

  // 2. Fungsi untuk submit update
  const handleUpdateCustomer = async (data) => {
    try {
      setIsLoading(true);

      const payload = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [
          k,
          typeof v === "string" ? v.trim() : v,
        ])
      );

      await updateCustomerAPI(code, payload);
      toast.success("Data customer berhasil diupdate!");
      navigate("/customers");
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const msg =
        (apiErrors && Object.values(apiErrors)[0]) ||
        error.response?.data?.message ||
        "Gagal mengupdate customer.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size={48} />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage message={error} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Perbarui informasi customer:{" "}
          <span className="font-semibold">{customer?.name || "-"}</span>
        </p>
      </div>
      <CustomerForm
        defaultValues={customer || {}}
        onFormSubmit={handleUpdateCustomer}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditCustomerPage;
