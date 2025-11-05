import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default true untuk desktop

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`
          flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}
        `}
      >
        <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="flex-1 p-4 mt-16 overflow-y-auto sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
