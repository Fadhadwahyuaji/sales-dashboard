// src/pages/transaction/TransactionListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTransactionsAPI } from "../../api/transaction";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Search, Eye, Filter, X } from "lucide-react";
import Button from "../../components/common/button";
import { format } from "date-fns";

// Komponen Pagination yang lebih responsive
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Tampilkan max 5 halaman di desktop, 3 di mobile
  let displayPages = pages;
  const isMobile = window.innerWidth < 640;
  const maxPages = isMobile ? 3 : 5;

  if (totalPages > maxPages) {
    const halfRange = Math.floor(maxPages / 2);
    if (currentPage <= halfRange + 1) {
      displayPages = pages.slice(0, maxPages);
    } else if (currentPage >= totalPages - halfRange) {
      displayPages = pages.slice(totalPages - maxPages, totalPages);
    } else {
      displayPages = pages.slice(
        currentPage - halfRange - 1,
        currentPage + halfRange
      );
    }
  }

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* First & Prev - Sembunyikan teks di mobile */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        title="First Page"
      >
        <span className="hidden sm:inline">First</span>
        <span className="sm:hidden">«</span>
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        title="Previous Page"
      >
        <span className="hidden sm:inline">Prev</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Page Numbers */}
      {displayPages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next & Last */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        title="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        title="Last Page"
      >
        <span className="hidden sm:inline">Last</span>
        <span className="sm:hidden">»</span>
      </button>
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

// Helper untuk konversi nilai ke number
const toNumber = (val) => {
  if (typeof val === "string") {
    const normalized = val.replace(/\./g, "").replace(/,/g, ".");
    const n = Number(normalized);
    return Number.isNaN(n) ? 0 : n;
  }
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
};

// Komponen Card untuk mobile view
const TransactionCard = ({ transaction }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-xs text-gray-500">
          {transaction.createdAt
            ? format(new Date(transaction.createdAt), "dd MMM yyyy, HH:mm")
            : "-"}
        </p>
        <p className="font-semibold text-gray-900 mt-1">
          {transaction.referenceNo}
        </p>
      </div>
      <Link
        to={`/transactions/${transaction.referenceNo}`}
        className="text-blue-600 hover:text-blue-900 p-2"
      >
        <Eye className="w-5 h-5" />
      </Link>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Customer:</span>
        <span className="text-gray-900 font-medium text-right">
          {transaction.customer?.name || "-"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Sales:</span>
        <span className="text-gray-900">{transaction.sales || "-"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Total:</span>
        <span className="text-gray-900 font-semibold">
          {formatCurrency(toNumber(transaction.amountTotal))}
        </span>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-200">
        <span className="text-gray-500">Sisa Tagihan:</span>
        <span className="text-red-600 font-semibold">
          {formatCurrency(toNumber(transaction.amountDue))}
        </span>
      </div>
    </div>
  </div>
);

const TransactionListPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // State untuk filter dan pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(
    format(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      "yyyy-MM-dd"
    )
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [sortBy] = useState("created_at");
  const [sortDirection] = useState("desc");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (new Date(startDate) > new Date(endDate)) {
        setError("Tanggal awal tidak boleh lebih besar dari tanggal akhir.");
        setLoading(false);
        return;
      }

      const params = {
        page,
        perPage,
        search,
        startDate,
        endDate,
        sortBy,
        sortDirection,
      };
      const res = await getTransactionsAPI(params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
    setShowFilter(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilter = () => {
    setSearch("");
    setStartDate(
      format(
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        "yyyy-MM-dd"
      )
    );
    setEndDate(format(new Date(), "yyyy-MM-dd"));
  };

  const transactions = data?.items || [];
  const currentPage = data?.currentPage ?? 1;
  const totalPages = data?.lastPage ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Daftar Transaksi
        </h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <p className="text-sm text-gray-500">
            Total: <span className="font-semibold">{total}</span> transaksi
          </p>
          {/* Toggle Filter Button (Mobile) */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="sm:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showFilter ? (
              <X className="w-5 h-5" />
            ) : (
              <Filter className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className={`p-4 bg-white rounded-lg shadow-sm ${
          showFilter ? "block" : "hidden sm:block"
        }`}
      >
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          {/* Search */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari Transaksi
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Masukkan Reference No..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              isLoading={loading}
              className="flex-1"
              size="md"
            >
              <Search className="w-4 h-4" />
              Terapkan Filter
            </Button>
            <Button
              type="button"
              onClick={handleResetFilter}
              variant="outline"
              className="flex-1 sm:flex-none"
              size="md"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorMessage message={error} />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tgl. Transaksi
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference No
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sisa Tagihan
                    </th>
                    <th className="relative px-4 lg:px-6 py-3">
                      <span className="sr-only">Detail</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((trx) => (
                      <tr key={trx.referenceNo} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trx.createdAt
                            ? format(
                                new Date(trx.createdAt),
                                "dd MMM yyyy, HH:mm"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trx.referenceNo}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                          <div>
                            <div className="font-medium text-gray-900">
                              {trx.customer?.name || "-"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {trx.customer?.code || "-"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trx.sales || "-"}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(toNumber(trx.amountTotal))}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {formatCurrency(toNumber(trx.amountDue))}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/transactions/${trx.referenceNo}`}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((trx) => (
                  <div key={trx.referenceNo} className="p-4">
                    <TransactionCard transaction={trx} />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  Data tidak ditemukan.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
                    Halaman <span className="font-medium">{currentPage}</span>{" "}
                    dari <span className="font-medium">{totalPages}</span>
                  </p>
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
  );
};

export default TransactionListPage;
