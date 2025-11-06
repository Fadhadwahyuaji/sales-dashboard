// src/pages/customer/CustomerListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCustomersAPI } from "../../api/customer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Plus, Edit, Search, Eye } from "lucide-react";
import Button from "../../components/common/button";

// Komponen Pagination sederhana
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center space-x-1">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const CustomerListPage = () => {
  const [data, setData] = useState(null); // Akan berisi { data: [], meta: {} }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk filter dan pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");

  // Helper badge status (tema lembut seperti contoh)
  const getStatusBadge = (status) => {
    const s = (status || "active").toString().toLowerCase();
    if (["inactive", "nonaktif", "disabled", "0", "false"].includes(s)) {
      return {
        text: "Nonaktif",
        classes: "bg-red-50 text-red-700 ring-1 ring-red-200",
      };
    }
    return {
      text: "Aktif",
      classes: "bg-green-50 text-green-700 ring-1 ring-green-200",
    };
  };

  // Ubah: fetchCustomers menerima pageArg agar tidak tergantung state yang mungkin belum ter-update
  const fetchCustomers = async (pageArg = page) => {
    try {
      setLoading(true);
      setError(null);

      const params = { page: pageArg, perPage };
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const res = await getCustomersAPI(params);
      const items = res?.data?.items || res?.data?.data || [];
      const total = res?.data?.meta?.total ?? res?.data?.total ?? 0;

      setData({
        data: items,
        meta: {
          current_page: pageArg,
          total_pages: total ? Math.max(1, Math.ceil(total / perPage)) : 1,
          total,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat data customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Panggil ulang jika 'page' berubah

  const handleSearch = (e) => {
    e.preventDefault();
    // Jika sudah di halaman 1, langsung fetch; jika tidak, ubah page ke 1 agar useEffect trigger
    if (page === 1) {
      fetchCustomers(1);
    } else {
      setPage(1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page) setPage(newPage);
  };

  const customers = data?.data || [];
  const meta = data?.meta; // Pagination info

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Daftar Customer
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Kelola data customer Anda di sini
            </p>
          </div>
          <Link to="/customers/add">
            <Button className="w-full sm:w-auto flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama customer..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <Button
              type="submit"
              isLoading={loading}
              className="w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Cari
            </Button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorMessage message={error} />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-16 px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nama Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customers.length > 0 ? (
                    customers.map((customer, index) => {
                      const no = (page - 1) * perPage + index + 1;
                      const badge = getStatusBadge(customer.status);
                      return (
                        <tr
                          key={`${customer.code}-${index}`}
                          className="group hover:bg-gray-50 transition-colors"
                        >
                          <td className="w-16 px-6 py-4 text-sm text-gray-500">
                            {no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-800">
                              {customer.code || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">
                                {customer.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {customer.email || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {customer.phone || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.classes}`}
                            >
                              {badge.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/customers/${customer.code}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200 transition-colors"
                                title="Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/customers/edit/${customer.code}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 ring-1 ring-yellow-200 transition-colors"
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
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm">Data tidak ditemukan.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {customers.length > 0 ? (
                customers.map((customer, index) => {
                  const badge = getStatusBadge(customer.status);
                  return (
                    <div
                      key={`${customer.code}-${index}`}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {customer.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {customer.email || "-"}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            Kode:{" "}
                            <span className="font-medium">
                              {customer.code || "-"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-600">
                            Telepon: {customer.phone || "-"}
                          </p>
                        </div>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.classes}`}
                        >
                          {badge.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 justify-end">
                        <Link
                          to={`/customers/${customer.code}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200 transition-colors"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/customers/edit/${customer.code}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 ring-1 ring-yellow-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-sm text-gray-500">
                  Data tidak ditemukan.
                </div>
              )}
            </div>

            {/* Pagination */}
            {meta && meta.total_pages > 1 && (
              <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Halaman {meta.current_page} dari {meta.total_pages}
                  </div>
                  <Pagination
                    currentPage={meta.current_page}
                    totalPages={meta.total_pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerListPage;
