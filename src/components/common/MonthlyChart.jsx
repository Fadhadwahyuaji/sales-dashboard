import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Normalisasi label bulan agar aman dipakai di chart
const formatMonthLabel = (month) => {
  if (!month) return "-";
  // YYYY-MM -> jadikan tanggal hari pertama
  if (/^\d{4}-\d{2}$/.test(month)) {
    return format(new Date(`${month}-01`), "MMM yyyy", { locale: id });
  }
  // YYYY-MM-DD -> format langsung
  if (/^\d{4}-\d{2}-\d{2}$/.test(month)) {
    return format(new Date(month), "MMM yyyy", { locale: id });
  }
  // Selain itu (mis. "Jan", "Feb") pakai apa adanya
  return month;
};

const MonthlyChart = ({ data = [] }) => {
  const safe = Array.isArray(data) ? data : [];

  const chartData = safe.map((item) => ({
    name: formatMonthLabel(item.month),
    "Total Transaksi": parseFloat(item.current || 0),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        Belum ada data transaksi bulanan
      </div>
    );
  }

  return (
    <div className="w-full" style={{ minHeight: "320px", height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                notation: "compact",
              }).format(value)
            }
            fontSize={12}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Total Transaksi"
            stroke="#2563eb"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
