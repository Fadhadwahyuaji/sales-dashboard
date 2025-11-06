// src/pages/transaction/TransactionDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTransactionDetailAPI } from "../../api/transaction";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/button";
import { ArrowLeft, Package } from "lucide-react";
import { format } from "date-fns";

// Helper format Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Tambahkan helper untuk konversi string angka "325.000.000" -> number
const toNumber = (val) => {
  if (typeof val === "string") {
    const normalized = val.replace(/\./g, "").replace(/,/g, ".");
    const n = Number(normalized);
    return Number.isNaN(n) ? 0 : n;
  }
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
};

// Komponen helper untuk info item
const InfoItem = ({ label, value, className = "" }) => (
  <div className={`py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words">
      {value || "-"}
    </dd>
  </div>
);

// Komponen Card untuk item produk di mobile
const ProductItemCard = ({ item, index }) => (
  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">
            Item #{index + 1}
          </span>
        </div>
        <h4 className="font-semibold text-gray-900 mt-1">
          {item.productName || item.product_name || item.name}
        </h4>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span className="text-gray-500 block">Jumlah</span>
        <span className="font-medium text-gray-900">
          {toNumber(item.quantity)}
        </span>
      </div>
      <div>
        <span className="text-gray-500 block">Diskon</span>
        <span className="font-medium text-gray-900">
          {toNumber(item.discount)}%
        </span>
      </div>
      <div>
        <span className="text-gray-500 block">Harga Satuan</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(toNumber(item.price))}
        </span>
      </div>
      <div>
        <span className="text-gray-500 block">Subtotal</span>
        <span className="font-medium text-gray-900">
          {formatCurrency(toNumber(item.priceSubtotal || item.price_subtotal))}
        </span>
      </div>
      <div className="col-span-2">
        <span className="text-gray-500 block">Margin</span>
        <span className="font-semibold text-green-600">
          {formatCurrency(
            toNumber(item.marginSubtotal || item.margin_subtotal)
          )}
        </span>
      </div>
    </div>
  </div>
);

// Komponen Summary Card untuk mobile
const SummaryCard = ({ label, value, variant = "default" }) => {
  const variants = {
    default: "bg-gray-50 text-gray-900",
    primary: "bg-blue-50 text-blue-900",
    danger: "bg-red-50 text-red-900",
  };

  return (
    <div className={`p-4 rounded-lg ${variants[variant]}`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
};

const TransactionDetailPage = () => {
  const { referenceNo } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTransactionDetailAPI(referenceNo);

        // Ambil payload dengan fallback sesuai bentuk respons API
        const payload =
          res?.data?.data ??
          res?.data?.item ??
          res?.data?.transaction ??
          res?.data;

        if (
          !payload ||
          (typeof payload === "object" && Object.keys(payload).length === 0)
        ) {
          throw new Error("Transaksi tidak ditemukan.");
        }

        setTransaction(payload);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat detail transaksi."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [referenceNo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-0">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="px-4 sm:px-0">
        <ErrorMessage message="Transaksi tidak ditemukan." />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div>
        {/* <Link
          to="/transactions"
          className="inline-flex items-center mb-3 sm:mb-4 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Transaksi
              </Link> */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => navigate("/transactions")}
            className="mb-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 break-words">
          Detail Transaksi
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {transaction.referenceNo || transaction.reference_no}
        </p>
      </div>

      {/* Info Transaksi */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Informasi Transaksi
        </h3>
        <dl className="divide-y divide-gray-200">
          <InfoItem
            label="Reference No"
            value={transaction.referenceNo || transaction.reference_no}
          />
          <InfoItem
            label="Tanggal Order"
            value={
              transaction.dateOrder || transaction.date_order
                ? format(
                    new Date(transaction.dateOrder || transaction.date_order),
                    "dd MMMM yyyy"
                  )
                : "-"
            }
          />
          <InfoItem
            label="Tanggal Jatuh Tempo"
            value={
              transaction.dateDue || transaction.date_due
                ? format(
                    new Date(transaction.dateDue || transaction.date_due),
                    "dd MMMM yyyy"
                  )
                : "-"
            }
          />
          <InfoItem
            label="Tanggal Pembayaran"
            value={
              transaction.paidAt || transaction.paid_at
                ? format(
                    new Date(transaction.paidAt || transaction.paid_at),
                    "dd MMMM yyyy"
                  )
                : "Belum Dibayar"
            }
          />
          <InfoItem
            label="Nama Customer"
            value={transaction.customer?.name || "-"}
          />
          <InfoItem
            label="Kode Customer"
            value={transaction.customer?.code || "-"}
          />
          <InfoItem
            label="Nama Sales"
            value={transaction.sales?.name || transaction.sales || "-"}
          />
        </dl>
      </div>

      {/* Rincian Item Transaksi */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Rincian Item
        </h3>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Nama Produk
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Jumlah
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Harga Satuan
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Diskon (%)
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Subtotal
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transaction.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {item.productName || item.product_name || item.name}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {toNumber(item.quantity)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(toNumber(item.price))}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {toNumber(item.discount)}%
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(
                        toNumber(item.priceSubtotal || item.price_subtotal)
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(
                        toNumber(item.marginSubtotal || item.margin_subtotal)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tablet View - Simplified Table */}
        <div className="hidden md:block lg:hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Produk
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Qty
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Harga
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transaction.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium text-gray-900">
                        {item.productName || item.product_name || item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Diskon: {toNumber(item.discount)}%
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {toNumber(item.quantity)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(toNumber(item.price))}
                    </td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(
                        toNumber(item.priceSubtotal || item.price_subtotal)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {transaction.items?.map((item, idx) => (
            <ProductItemCard key={idx} item={item} index={idx} />
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          {/* Desktop Summary */}
          <div className="hidden md:block">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Subtotal (Sebelum Pajak)
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(
                    toNumber(
                      transaction.amountUntaxed ??
                        transaction.amount_untaxed ??
                        0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  Total (Termasuk Pajak)
                </span>
                <span className="font-bold text-gray-900 text-lg">
                  {formatCurrency(
                    toNumber(
                      transaction.amountTotal ??
                        transaction.amount_total ??
                        transaction.total ??
                        0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  Sisa Tagihan
                </span>
                <span className="font-bold text-red-600 text-lg">
                  {formatCurrency(
                    toNumber(
                      transaction.amountDue ?? transaction.amount_due ?? 0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Summary Cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            <SummaryCard
              label="Subtotal (Sebelum Pajak)"
              value={formatCurrency(
                toNumber(
                  transaction.amountUntaxed ?? transaction.amount_untaxed ?? 0
                )
              )}
              variant="default"
            />
            <SummaryCard
              label="Total (Termasuk Pajak)"
              value={formatCurrency(
                toNumber(
                  transaction.amountTotal ??
                    transaction.amount_total ??
                    transaction.total ??
                    0
                )
              )}
              variant="primary"
            />
            <SummaryCard
              label="Sisa Tagihan"
              value={formatCurrency(
                toNumber(transaction.amountDue ?? transaction.amount_due ?? 0)
              )}
              variant="danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
