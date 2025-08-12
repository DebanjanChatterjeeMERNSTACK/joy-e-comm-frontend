import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile (overlay) and Desktop (permanent) */}
      <aside
        className={`fixed lg:static z-50 w-72 h-full transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        {/* <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
         
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Dashboard
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Welcome to your beautiful dashboard!
              </p>
            </div>
            
           
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
              {children || (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Your content will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </main> */}
        <Outlet/>
      </div>
    </div>
  );
}