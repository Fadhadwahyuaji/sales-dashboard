import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { ChevronDown, LogOut, Menu, X, User } from "lucide-react";

const UserDropdown = ({ user, onLogout, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <div className="flex items-center justify-center w-8 h-8 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
          <span className="text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <span className="hidden md:inline max-w-[120px] truncate">
          {user?.name || "User"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => onToggle(false)}
          />
          <div className="absolute right-0 w-56 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <div className="py-1">
              <button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil");
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "left-0 lg:left-64" : "left-0"}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-gray-800">
              Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="md:hidden">
            <h1 className="text-base font-semibold text-gray-800">Dashboard</h1>
          </div>
        </div>

        <UserDropdown
          user={user}
          onLogout={handleLogout}
          isOpen={dropdownOpen}
          onToggle={setDropdownOpen}
        />
      </div>
    </header>
  );
};

export default Navbar;
