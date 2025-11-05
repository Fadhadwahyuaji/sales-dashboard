// src/components/common/LoadingSpinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = 24 }) => (
  <div className="flex items-center justify-center w-full h-full p-10">
    <Loader2
      className="animate-spin text-blue-600"
      style={{ width: size, height: size }}
    />
  </div>
);

export default LoadingSpinner;
