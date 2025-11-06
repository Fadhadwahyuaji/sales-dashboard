// src/pages/transaction/TransactionDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTransactionDetailAPI } from "../../api/transaction";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { ArrowLeft } from "lucide-react";
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

// Komponen helper
const InfoItem = ({ label, value }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value || "-"}
    </dd>
  </div>
);

const TransactionDetailPage = () => {
  const { referenceNo } = useParams();
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

  if (loading) return <LoadingSpinner size={48} />;
  if (error) return <ErrorMessage message={error} />;
  if (!transaction)
    return <ErrorMessage message="Transaksi tidak ditemukan." />;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/transactions"
          className="flex items-center mb-4 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Transaksi
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">
          Detail Transaksi:{" "}
          {transaction.referenceNo || transaction.reference_no}
        </h1>
      </div>

      {/* Info Transaksi */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
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
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Rincian Item</h3>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                    <tr key={idx}>
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
                <tfoot className="bg-gray-50">
                  <tr>
                    <th
                      colSpan="4"
                      className="pt-4 pr-3 text-right text-sm font-medium text-gray-900"
                    >
                      Subtotal (Sebelum Pajak)
                    </th>
                    <td
                      className="pt-4 pl-3 text-sm font-semibold text-gray-900"
                      colSpan="2"
                    >
                      {formatCurrency(
                        toNumber(
                          transaction.amountUntaxed ??
                            transaction.amount_untaxed ??
                            0
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan="4"
                      className="pt-2 pr-3 text-right text-sm font-medium text-gray-900"
                    >
                      Total (Termasuk Pajak)
                    </th>
                    <td
                      className="pt-2 pl-3 text-sm font-semibold text-gray-900"
                      colSpan="2"
                    >
                      {formatCurrency(
                        toNumber(
                          transaction.amountTotal ??
                            transaction.amount_total ??
                            transaction.total ??
                            0
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan="4"
                      className="pt-2 pr-3 text-right text-sm font-medium text-gray-900"
                    >
                      Sisa Tagihan
                    </th>
                    <td
                      className="pt-2 pl-3 text-sm font-semibold text-red-600"
                      colSpan="2"
                    >
                      {formatCurrency(
                        toNumber(
                          transaction.amountDue ?? transaction.amount_due ?? 0
                        )
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
