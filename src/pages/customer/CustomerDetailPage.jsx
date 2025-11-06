import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCustomerDetailAPI } from "../../api/customer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/button";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  CreditCard,
  FileText,
} from "lucide-react";

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getCustomerDetailAPI(code);
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
        setIsLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [code]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size={48} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage message={error} />
        <div className="mt-4">
          <Button
            onClick={() => navigate("/customers")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => navigate("/customers")}
          className="mb-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detail Customer
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Informasi lengkap customer
            </p>
          </div>
          <Link to={`/customers/edit/${customer?.code}`}>
            <Button className="w-full sm:w-auto flex items-center justify-center">
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informasi Dasar
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode Customer
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {customer?.code || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {customer?.name || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                    <Building2 className="w-3 h-3 mr-1" />
                    Tipe Perusahaan
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer?.companyType === "company"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {customer?.companyType === "company"
                        ? "Company"
                        : "Person"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Informasi Kontak
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer?.email || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    Telepon
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer?.phone || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    No. HP
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer?.mobile_phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Alamat
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provinsi
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer?.province?.name || customer?.provinceCode || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kota/Kabupaten
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer?.city?.name || customer?.cityCode || "-"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat Lengkap
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {customer?.address || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Identitas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Identitas (KTP/SIM)
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {customer?.identityNo || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPWP
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {customer?.npwp || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informasi Sistem
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat Pada
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {customer?.created_at
                    ? new Date(customer.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir Diupdate
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {customer?.updated_at
                    ? new Date(customer.updated_at).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Aksi Cepat
              </h3>
              <div className="space-y-2">
                <Link to={`/customers/edit/${customer?.code}`}>
                  <Button className="w-full justify-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Customer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
