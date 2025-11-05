import React, { useState, useEffect } from "react";
import { format, subDays, startOfMonth } from "date-fns";
import {
  getDailySummaryAPI,
  getMonthlySummaryAPI,
  getYearlySummaryAPI,
  getTopCustomersAPI,
} from "../../api/summary";
import StatCard from "../../components/common/StatCard";
import MonthlyChart from "../../components/common/MonthlyChart";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { DollarSign, ShoppingCart, Users, Calendar } from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const SummaryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk filter tanggal
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"), // Awal bulan ini
    endDate: format(new Date(), "yyyy-MM-dd"), // Hari ini
  });

  const fetchSummaryData = async (customDateRange = null) => {
    try {
      setLoading(true);
      setError(null);

      const currentRange = customDateRange || dateRange;
      const year = format(new Date(), "yyyy");

      const results = await Promise.allSettled([
        getDailySummaryAPI({
          startDate: currentRange.startDate,
          endDate: currentRange.endDate,
        }),
        getMonthlySummaryAPI({
          startMonth: `${year}-01`,
          endMonth: `${year}-12`,
        }),
        getYearlySummaryAPI({ year }),
        getTopCustomersAPI({
          startDate: currentRange.startDate,
          endDate: currentRange.endDate,
          limit: 5,
        }),
      ]);

      const [dailyRes, monthlyRes, yearlyRes, topCustomersRes] = results;

      if (results.some((res) => res.status === "rejected")) {
        const errors = results
          .filter((res) => res.status === "rejected")
          .map((res) => res.reason);
        console.error("API Errors:", errors);
        throw errors[0];
      }

      // Extract data sesuai struktur API response
      const dailyItems = dailyRes.value?.data?.items || [];
      const monthlyItems = monthlyRes.value?.data?.items || [];
      const yearlyData = yearlyRes.value?.data || {};
      const topCustomersItems = topCustomersRes.value?.data?.items || [];

      // Hitung total untuk rentang tanggal yang dipilih
      const totalAmount = dailyItems.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );

      const summaryData = {
        daily: {
          total: totalAmount,
          count: dailyItems.length,
          items: dailyItems,
        },
        monthly: monthlyItems,
        yearly: {
          total: yearlyData.current?.amount
            ? parseFloat(yearlyData.current.amount)
            : 0,
          percentage: yearlyData.percentage || "0",
          year: yearlyData.current?.year || year,
        },
        topCustomers: topCustomersItems,
      };

      setData(summaryData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal memuat data summary."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    fetchSummaryData(dateRange);
  };

  // Preset filters
  const handlePresetFilter = (preset) => {
    let newRange;
    const today = new Date();

    switch (preset) {
      case "today":
        newRange = {
          startDate: format(today, "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        };
        break;
      case "week":
        newRange = {
          startDate: format(subDays(today, 7), "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        };
        break;
      case "month":
        newRange = {
          startDate: format(startOfMonth(today), "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
        };
        break;
      default:
        return;
    }

    setDateRange(newRange);
    fetchSummaryData(newRange);
  };

  if (loading) {
    return <LoadingSpinner size={48} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return <ErrorMessage message="Data tidak tersedia" />;
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <DateRangeFilter
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onStartDateChange={(value) => handleDateRangeChange("startDate", value)}
        onEndDateChange={(value) => handleDateRangeChange("endDate", value)}
        onApply={handleApplyFilter}
      />

      {/* Quick Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handlePresetFilter("today")}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        >
          Hari Ini
        </button>
        <button
          onClick={() => handlePresetFilter("week")}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        >
          7 Hari Terakhir
        </button>
        <button
          onClick={() => handlePresetFilter("month")}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        >
          Bulan Ini
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`Transaksi (${dateRange.startDate} - ${dateRange.endDate})`}
          value={formatCurrency(data.daily?.total ?? 0)}
          icon={DollarSign}
        />
        <StatCard
          title="Transaksi Tahun Ini"
          value={formatCurrency(data.yearly?.total ?? 0)}
          icon={Calendar}
        />
        <StatCard
          title={`Jumlah Transaksi (Periode Terpilih)`}
          value={data.daily?.count ?? 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Pelanggan Teratas (Periode Terpilih)"
          value={data.topCustomers?.[0]?.customer?.name ?? "-"}
          icon={Users}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Grafik Transaksi Bulanan ({format(new Date(), "yyyy")})
          </h3>
          <MonthlyChart
            data={Array.isArray(data.monthly) ? data.monthly : []}
          />
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Top 5 Pelanggan (Periode Terpilih)
          </h3>
          <ul className="space-y-3">
            {Array.isArray(data.topCustomers) &&
            data.topCustomers.length > 0 ? (
              data.topCustomers.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.customer?.name || "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.customer?.companyType || "person"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency(parseFloat(item.amount || 0))}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">Belum ada data pelanggan.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
