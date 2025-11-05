import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";

const UserDropdown = ({ user, onLogout, isOpen, onToggle }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex items-center p-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
    >
      <span className="hidden sm:inline">{user?.name || "User"}</span>
      <span className="inline sm:hidden">{user?.name?.charAt(0) || "U"}</span>
      <ChevronDown
        className={`w-4 h-4 ml-1 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isOpen && (
      <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
        <div className="px-4 py-2 border-b sm:hidden">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    )}
  </div>
);

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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out
        ${sidebarOpen ? "left-0 lg:left-64" : "left-0"}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="ml-2">
            <h1 className="text-sm sm:text-lg font-semibold text-gray-800">
              <span className="hidden sm:inline">
                Welcome, {user?.name || "User"}
              </span>
              <span className="inline sm:hidden">Dashboard</span>
            </h1>
          </div>
        </div>

        <UserDropdown
          user={user}
          onLogout={handleLogout}
          isOpen={dropdownOpen}
          onToggle={toggleDropdown}
        />
      </div>
    </header>
  );
};

export default Navbar;
