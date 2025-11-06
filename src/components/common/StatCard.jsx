import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "bg-blue-100 text-blue-600",
}) => {
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2 break-words">
            {value}
          </p>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColor} flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
