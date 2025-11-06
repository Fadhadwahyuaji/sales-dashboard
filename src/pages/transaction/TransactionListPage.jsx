// src/pages/transaction/TransactionListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTransactionsAPI } from "../../api/transaction";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Search, Eye } from "lucide-react";
import Button from "../../components/common/button";
import { format } from "date-fns";

// Komponen Pagination (Kita asumsikan sudah ada dari Customer)
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

// Helper format Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const TransactionListPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk filter dan pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  // Filter tanggal, default 1 bulan terakhir
  const [startDate, setStartDate] = useState(
    format(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      "yyyy-MM-dd"
    )
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, perPage, search, startDate, endDate };
      const res = await getTransactionsAPI(params);
      setData(res.data); // Asumsi res.data berisi { data: [...], meta: {...} }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]); // Panggil ulang jika 'page' berubah

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman 1 saat filter
    fetchTransactions();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const transactions = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Daftar Transaksi</h1>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Reference No..."
            className="md:col-span-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <Button type="submit" isLoading={loading} className="md:col-span-4">
            <Search className="w-4 h-4 mr-2" />
            Terapkan Filter
          </Button>
        </form>
      </div>

      {/* Konten Tabel */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tgl. Transaksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reference No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Detail</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((trx) => (
                    <tr key={trx.reference_no}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(trx.created_at), "dd MMM yyyy, HH:mm")}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {trx.reference_no}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trx.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatCurrency(trx.total)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link
                          to={`/transactions/${trx.reference_no}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total_pages > 1 && !loading && (
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;
