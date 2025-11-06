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
import {
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  UserCircle,
} from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatCompactCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    minimumFractionDigits: 0,
  }).format(value);
};

const SummaryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk filter tanggal
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
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
          current: {
            year: yearlyData.current?.year || year,
            amount: parseFloat(yearlyData.current?.amount || 0),
          },
          previous: {
            year: yearlyData.previous?.year || parseInt(year) - 1,
            amount: parseFloat(yearlyData.previous?.amount || 0),
          },
          percentage: parseFloat(yearlyData.percentage || 0),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return <ErrorMessage message="Data tidak tersedia" />;
  }

  const growthIsPositive = data.yearly?.percentage >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Summary</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan performa penjualan dan transaksi
        </p>
      </div>

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
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Hari Ini
        </button>
        <button
          onClick={() => handlePresetFilter("week")}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          7 Hari Terakhir
        </button>
        <button
          onClick={() => handlePresetFilter("month")}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Bulan Ini
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transaksi (Periode)"
          value={formatCompactCurrency(data.daily?.total ?? 0)}
          subtitle={`${dateRange.startDate} - ${dateRange.endDate}`}
          icon={DollarSign}
          iconColor="bg-blue-100 text-blue-600"
        />

        <StatCard
          title={`Transaksi ${data.yearly?.current?.year}`}
          value={formatCompactCurrency(data.yearly?.current?.amount ?? 0)}
          subtitle={
            <div className="flex items-center gap-1">
              {growthIsPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={growthIsPositive ? "text-green-600" : "text-red-600"}
              >
                {Math.abs(data.yearly?.percentage ?? 0)}% vs{" "}
                {data.yearly?.previous?.year}
              </span>
            </div>
          }
          icon={Calendar}
          iconColor="bg-green-100 text-green-600"
        />

        <StatCard
          title="Jumlah Hari Transaksi"
          value={data.daily?.count ?? 0}
          subtitle="Dalam periode terpilih"
          icon={ShoppingCart}
          iconColor="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Top Customer"
          value={(() => {
            const name = data.topCustomers?.[0]?.customer?.name;
            return name
              ? name.length > 20
                ? name.substring(0, 20) + "..."
                : name
              : "-";
          })()}
          subtitle={formatCompactCurrency(
            parseFloat(data.topCustomers?.[0]?.amount || 0)
          )}
          icon={Users}
          iconColor="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Grafik Transaksi Bulanan
              </h3>
              <p className="text-sm text-gray-500">
                Perbandingan tahun {data.yearly?.current?.year} vs{" "}
                {data.yearly?.previous?.year}
              </p>
            </div>
          </div>
          <MonthlyChart
            data={Array.isArray(data.monthly) ? data.monthly : []}
          />
        </div>

        {/* Top Customers List */}
        <div className="p-6 bg-white rounded-lg shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top 5 Pelanggan
              </h3>
              <p className="text-sm text-gray-500">Periode terpilih</p>
            </div>
          </div>

          <div className="space-y-4">
            {Array.isArray(data.topCustomers) &&
            data.topCustomers.length > 0 ? (
              data.topCustomers.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {item.customer?.companyType === "company" ? (
                        <Building2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <UserCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.customer?.name || "-"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {item.customer?.code || "-"}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {item.customer?.companyType === "company"
                              ? "PT"
                              : "Individu"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500">#{index + 1}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-blue-600 mt-2">
                      {formatCurrency(parseFloat(item.amount || 0))}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  Belum ada data pelanggan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yearly Comparison Card */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Perbandingan Tahunan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">
              Tahun {data.yearly?.current?.year}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatCompactCurrency(data.yearly?.current?.amount ?? 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">
              Tahun {data.yearly?.previous?.year}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatCompactCurrency(data.yearly?.previous?.amount ?? 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Pertumbuhan</p>
            <div className="flex items-center gap-2">
              {growthIsPositive ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
              <p
                className={`text-xl font-bold ${
                  growthIsPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {growthIsPositive ? "+" : ""}
                {data.yearly?.percentage ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
