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

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const MonthlyChart = ({ data = [] }) => {
  const safe = Array.isArray(data) ? data : [];

  const chartData = safe.map((item) => ({
    name: item.month || "-",
    "Tahun Ini": parseFloat(item.current || 0),
    "Tahun Lalu": parseFloat(item.previous || 0),
    growth: parseFloat(item.growth || 0),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        Belum ada data transaksi bulanan
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">
            {payload[0].payload.name}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <p
            className={`text-sm font-semibold mt-1 ${
              payload[0].payload.growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Growth: {payload[0].payload.growth >= 0 ? "+" : ""}
            {payload[0].payload.growth}%
          </p>
        </div>
      );
    }
    return null;
  };

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
                minimumFractionDigits: 0,
              }).format(value)
            }
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Tahun Ini"
            stroke="#2563eb"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Tahun Lalu"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
