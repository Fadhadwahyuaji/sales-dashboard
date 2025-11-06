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
  Target,
  TrendingUp,
  Users,
  Smartphone,
} from "lucide-react";

// Badge Component untuk Type
const TypeBadge = ({ type }) => {
  const typeConfig = {
    PROSPECT: {
      text: "Prospect",
      classes: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
      icon: Target,
    },
    CUSTOMER: {
      text: "Customer",
      classes: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      icon: Users,
    },
  };

  const config = typeConfig[type] || typeConfig.PROSPECT;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${config.classes}`}
    >
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

// Badge Component untuk Company Type
const CompanyTypeBadge = ({ companyType }) => {
  const Icon = companyType === "company" ? Building2 : User;
  const config = {
    company: {
      text: "Perusahaan",
      classes: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
    },
    person: {
      text: "Perorangan",
      classes: "bg-green-100 text-green-800 ring-1 ring-green-200",
    },
  };

  const current = config[companyType] || config.person;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${current.classes}`}
    >
      <Icon className="w-4 h-4" />
      {current.text}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  if (!status) return null;

  const statusConfig = {
    Hunter: {
      classes: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
    },
    Farmer: {
      classes: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
    },
    Active: {
      classes: "bg-green-100 text-green-800 ring-1 ring-green-200",
    },
    Inactive: {
      classes: "bg-gray-100 text-gray-800 ring-1 ring-gray-200",
    },
  };

  const config = statusConfig[status] || statusConfig.Active;

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${config.classes}`}
    >
      {status}
    </span>
  );
};

// Info Item Component
const InfoItem = ({ label, value, icon: Icon, className = "" }) => {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </label>
      <p className="text-sm text-gray-900 font-medium">
        {value || <span className="text-gray-400">-</span>}
      </p>
    </div>
  );
};

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
        setError(null);

        const response = await getCustomerDetailAPI(code);

        console.log("Customer Detail Response:", response.data);

        // Sesuaikan dengan struktur response
        const customerData = response?.data;

        if (customerData && customerData.responseCode === "20000") {
          setCustomer(customerData);
        } else {
          setError("Data customer tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(
          err?.response?.data?.responseMessage ||
            err?.message ||
            "Gagal memuat data customer."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchCustomerDetail();
    }
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size={48} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ErrorMessage message={error || "Data tidak ditemukan"} />
          <div className="mt-4">
            <Button
              onClick={() => navigate("/customers")}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Customer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => navigate("/customers")}
            className="mb-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {customer.name}
                  </h1>
                  <TypeBadge type={customer.type} />
                  <CompanyTypeBadge companyType={customer.companyType} />
                  {customer.status && <StatusBadge status={customer.status} />}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                      {customer.code}
                    </span>
                  </span>
                  {customer.area && (
                    <>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        Area:{" "}
                        <span className="font-medium">{customer.area}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/customers/edit/${customer.code}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full flex items-center justify-center shadow-sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Customer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Stats (if customer has target) */}
            {customer.target && parseFloat(customer.target) > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Performa Customer
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Target
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat("id-ID").format(
                          parseFloat(customer.target)
                        )}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Achievement
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat("id-ID").format(
                          parseFloat(customer.achievement)
                        )}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Persentase
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {customer.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Informasi Kontak
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem label="Email" value={customer.email} icon={Mail} />
                  <InfoItem
                    label="Telepon"
                    value={customer.phone}
                    icon={Phone}
                  />
                  <InfoItem
                    label="No. HP"
                    value={customer.mobilePhone}
                    icon={Smartphone}
                    className="sm:col-span-2"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Alamat
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem label="Provinsi" value={customer.province?.name} />
                  <InfoItem
                    label="Kota/Kabupaten"
                    value={customer.city?.name}
                  />
                  <InfoItem
                    label="Alamat Lengkap"
                    value={customer.address}
                    className="sm:col-span-2"
                  />
                </div>
              </div>
            </div>

            {/* Group Information */}
            {customer.group && (customer.group.code || customer.group.name) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Grup Customer
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoItem label="Kode Grup" value={customer.group.code} />
                    <InfoItem label="Nama Grup" value={customer.group.name} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Identity Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Identitas
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <InfoItem
                  label="No. Identitas (KTP/SIM)"
                  value={customer.identityNo}
                />
                <InfoItem label="NPWP" value={customer.npwp} />
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Informasi Sistem
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Dibuat Pada
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
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
            {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Aksi Cepat
                </h3>
                <div className="space-y-3">
                  <Link to={`/customers/edit/${customer.code}`}>
                    <Button className="w-full justify-center shadow-sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Customer
                    </Button>
                  </Link>
                  <Button
                    onClick={() => navigate("/customers")}
                    className="w-full justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
