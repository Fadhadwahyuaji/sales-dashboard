import React from "react";

// forwardRef agar bisa dihubungkan ke react-hook-form
const Input = React.forwardRef(
  ({ label, id, type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={id}
          type={type}
          ref={ref}
          {...props}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
