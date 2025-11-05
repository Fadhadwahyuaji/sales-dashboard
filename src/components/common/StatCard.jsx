// src/components/common/StatCard.jsx
import React from "react";

// Komponen 'kartu' untuk menampilkan statistik ringkas
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
      {Icon && (
        <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
