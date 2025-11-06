import React from "react";

const Input = React.forwardRef(
  (
    {
      id,
      label,
      type = "text",
      error,
      helperText,
      icon,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            type={type}
            className={`
              block w-full rounded-lg border transition-all duration-200
              ${icon ? "pl-10 pr-3" : "px-3"}
              py-2.5 text-sm
              ${
                hasError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-gray-100 disabled:cursor-not-allowed
              placeholder:text-gray-400
              ${className}
            `}
            {...props}
          />
        </div>

        {/* Error Message */}
        {hasError && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error?.message}
          </p>
        )}

        {/* Helper Text */}
        {!hasError && helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
