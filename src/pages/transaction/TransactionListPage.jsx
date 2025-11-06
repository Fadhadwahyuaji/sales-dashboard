// src/pages/transaction/TransactionListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTransactionsAPI } from "../../api/transaction";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { Search, Eye } from "lucide-react";
import Button from "../../components/common/button";
import { format } from "date-fns";

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Tampilkan max 5 halaman
  let displayPages = pages;
  if (totalPages > 5) {
    if (currentPage <= 3) {
      displayPages = pages.slice(0, 5);
    } else if (currentPage >= totalPages - 2) {
      displayPages = pages.slice(totalPages - 5, totalPages);
    } else {
      displayPages = pages.slice(currentPage - 3, currentPage + 2);
    }
  }

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {displayPages.map((page) => (
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
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Last
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

  // Tambahkan sort agar tidak 422 (required di API)
  const [sortBy] = useState("created_at");
  const [sortDirection] = useState("desc");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validasi rentang tanggal
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

      // API mengembalikan data langsung di root
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
  }, [page]); // Panggil ulang jika 'page' berubah

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman 1 saat filter
    fetchTransactions();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Ambil items dari response
  const transactions = data?.items || [];

  // Metadata pagination
  const currentPage = data?.currentPage ?? 1;
  const totalPages = data?.lastPage ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Daftar Transaksi
        </h1>
        <p className="text-sm text-gray-500">Total: {total} transaksi</p>
      </div>

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
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sisa Tagihan
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Detail</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((trx) => (
                    <tr key={trx.referenceNo}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trx.createdAt
                          ? format(
                              new Date(trx.createdAt),
                              "dd MMM yyyy, HH:mm"
                            )
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {trx.referenceNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>
                          <div className="font-medium text-gray-900">
                            {trx.customer?.name || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {trx.customer?.code || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trx.sales || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatCurrency(toNumber(trx.amountTotal))}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {formatCurrency(toNumber(trx.amountDue))}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
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
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Halaman <span className="font-medium">{currentPage}</span> dari{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;
