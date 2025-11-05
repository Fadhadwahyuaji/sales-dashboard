import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingCart, User } from "lucide-react";

const MENU_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Summary" },
  { to: "/customers", icon: Users, label: "Customer" },
  { to: "/transactions", icon: ShoppingCart, label: "Transaction" },
  { to: "/profile", icon: User, label: "My Profile" },
];

const SidebarLink = ({ to, icon, children, onClick }) => {
  const baseClasses =
    "flex items-center p-3 my-1 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors";
  const activeClasses = "bg-blue-100 text-blue-600 font-semibold";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : ""}`
      }
    >
      {React.createElement(icon, { className: "w-5 h-5 mr-3" })}
      <span className="truncate">{children}</span>
    </NavLink>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen p-4 bg-white border-r border-gray-200 shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-center pb-4 mb-4 border-b">
          <Link
            to="/dashboard"
            className="flex items-center"
            onClick={() => window.innerWidth < 1024 && onClose()}
          >
            <span className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              Sales Dashboard
            </span>
          </Link>
        </div>

        <nav className="flex-1">
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
      </aside>
    </>
  );
};

export default Sidebar;
