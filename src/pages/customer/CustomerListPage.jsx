import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCustomersAPI } from "../../api/customer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  Plus,
  Edit,
  Search,
  Eye,
  MapPin,
  Building2,
  User,
  X,
} from "lucide-react";
import Button from "../../components/common/button";

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors"
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="px-2 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

// Komponen Badge untuk Type
const TypeBadge = ({ type }) => {
  const typeConfig = {
    PROSPECT: {
      text: "Prospect",
      classes: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    },
    CUSTOMER: {
      text: "Customer",
      classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    },
  };

  const config = typeConfig[type] || typeConfig.PROSPECT;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.text}
    </span>
  );
};

// Komponen Badge untuk Company Type
const CompanyTypeBadge = ({ companyType }) => {
  const Icon = companyType === "company" ? Building2 : User;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
      <Icon className="w-3.5 h-3.5" />
      {companyType === "company" ? "Perusahaan" : "Perorangan"}
    </span>
  );
};

// Komponen Customer Card untuk Mobile
const CustomerCard = ({ customer }) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">
              {customer.name}
            </h3>
            <TypeBadge type={customer.type} />
          </div>

          <div className="space-y-1 mt-2">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Kode:</span> {customer.code}
            </p>
            <CompanyTypeBadge companyType={customer.companyType} />

            {(customer.province?.name || customer.city?.name) && (
              <div className="flex items-start gap-1 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>
                  {[customer.city?.name, customer.province?.name]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <Link
          to={`/customers/${customer.code}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Detail
        </Link>
        <Link
          to={`/customers/edit/${customer.code}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 ring-1 ring-yellow-200 transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </Link>
      </div>
    </div>
  );
};

// Main Component
const CustomerListPage = () => {
  const [allCustomers, setAllCustomers] = useState([]); // Semua data dari API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Fetch data customers (get all data)
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching all customers...");

      const response = await getCustomersAPI({});

      console.log("API Response:", response.data);

      // Sesuaikan dengan struktur response API
      const items = response?.data?.items || [];

      setAllCustomers(items);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(
        err?.response?.data?.responseMessage ||
          err?.message ||
          "Gagal memuat data customer."
      );
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter data berdasarkan search
  const filteredCustomers = useMemo(() => {
    if (!activeSearch || !activeSearch.trim()) {
      return allCustomers;
    }

    const searchLower = activeSearch.toLowerCase().trim();
    return allCustomers.filter((customer) => {
      const name = customer.name?.toLowerCase() || "";
      const code = customer.code?.toLowerCase() || "";
      const city = customer.city?.name?.toLowerCase() || "";
      const province = customer.province?.name?.toLowerCase() || "";

      return (
        name.includes(searchLower) ||
        code.includes(searchLower) ||
        city.includes(searchLower) ||
        province.includes(searchLower)
      );
    });
  }, [allCustomers, activeSearch]);

  // Pagination calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchInput);
    setCurrentPage(1); // Reset ke halaman 1 saat search
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset page saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Daftar Customer
              </h1>
              <p className="mt-1 sm:mt-2 text-sm text-gray-600">
                Kelola data customer Anda di sini
              </p>
            </div>
            <Link to="/customers/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto flex items-center justify-center shadow-sm">
                <Plus className="w-5 h-5 mr-2" />
                Tambah Customer
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Cari nama, kode, atau lokasi customer..."
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <Button type="submit" disabled={loading} className="px-6">
                Cari
              </Button>
            </form>

            {/* Active Search Info */}
            {activeSearch && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span>Hasil pencarian untuk:</span>
                <span className="font-medium text-gray-900">
                  "{activeSearch}"
                </span>
                <button
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Hapus filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 sm:py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorMessage message={error} />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-16 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Kode
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((customer, index) => {
                        const no = startIndex + index + 1;
                        return (
                          <tr
                            key={`${customer.code}-${index}`}
                            className="group hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-800">
                                {customer.code}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">
                                  {customer.name}
                                </span>
                                <CompanyTypeBadge
                                  companyType={customer.companyType}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <TypeBadge type={customer.type} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-start gap-1.5 text-sm text-gray-700">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                <div className="flex flex-col">
                                  {customer.city?.name && (
                                    <span>{customer.city.name}</span>
                                  )}
                                  {customer.province?.name && (
                                    <span className="text-xs text-gray-500">
                                      {customer.province.name}
                                    </span>
                                  )}
                                  {!customer.city?.name &&
                                    !customer.province?.name && (
                                      <span className="text-gray-400">-</span>
                                    )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to={`/customers/${customer.code}`}
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200 transition-colors"
                                  title="Detail"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/customers/edit/${customer.code}`}
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 ring-1 ring-yellow-200 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Search className="w-12 h-12 mb-3 text-gray-300" />
                            <p className="text-sm font-medium">
                              {activeSearch
                                ? "Data tidak ditemukan"
                                : "Belum ada data customer"}
                            </p>
                            <p className="text-xs mt-1">
                              {activeSearch
                                ? "Coba ubah kata kunci pencarian Anda"
                                : "Tambahkan customer baru dengan klik tombol di atas"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile & Tablet Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer, index) => (
                    <CustomerCard
                      key={`${customer.code}-${index}`}
                      customer={customer}
                    />
                  ))
                ) : (
                  <div className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">
                        {activeSearch
                          ? "Data tidak ditemukan"
                          : "Belum ada data customer"}
                      </p>
                      <p className="text-xs mt-1">
                        {activeSearch
                          ? "Coba ubah kata kunci pencarian Anda"
                          : "Tambahkan customer baru dengan klik tombol di atas"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 order-2 sm:order-1">
                      Menampilkan{" "}
                      <span className="font-medium">{startIndex + 1}</span> -{" "}
                      <span className="font-medium">
                        {Math.min(endIndex, totalItems)}
                      </span>{" "}
                      dari <span className="font-medium">{totalItems}</span>{" "}
                      data
                    </div>
                    <div className="order-1 sm:order-2">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerListPage;
