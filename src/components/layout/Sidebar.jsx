import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingCart, User, X } from "lucide-react";

const MENU_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Summary" },
  { to: "/customers", icon: Users, label: "Customer" },
  { to: "/transactions", icon: ShoppingCart, label: "Transaction" },
  { to: "/profile", icon: User, label: "My Profile" },
];

const SidebarLink = ({ to, icon, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all duration-200 group
        ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {React.createElement(icon, {
            className: `w-5 h-5 transition-transform duration-200 ${
              isActive ? "scale-110" : "group-hover:scale-110"
            }`,
          })}
          <span className="font-medium truncate">{children}</span>
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link
              to="/dashboard"
              className="flex items-center gap-2"
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Sales Dashboard
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => (
                <li key={item.to}>
                  <SidebarLink
                    to={item.to}
                    icon={item.icon}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    {item.label}
                  </SidebarLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          {/* <div className="p-4 border-t border-gray-200">
            <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-xs font-semibold text-blue-900">Need Help?</p>
              <p className="text-xs text-blue-700 mt-1">
                Contact support for assistance
              </p>
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
