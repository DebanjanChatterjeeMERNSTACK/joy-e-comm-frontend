import { Menu, Bell, Search, ChevronDown, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ setSidebarOpen }) {

const [userRole, setUserRole] = useState(null);

   useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setUserRole(decoded.storeName);
        } catch (err) {
          console.error("Invalid token", err);
          setUserRole(null);
        }
      }
    }, []); // <- important: only run once on mount
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between dark:bg-gray-900/80 dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        {/* Search Bar */}
       
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}

        {/* Notifications */}
        {/* <button className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gray-300  rounded-full p-2 transition-colors"
          >
            {/* <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
              DD
            </div> */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
              {userRole}
            </span>
           
          </button>

          {/* Dropdown Menu */}
          {/* {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-gray-800 dark:border dark:border-gray-700">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign out
              </a>
            </div>
          )} */}
        </div>
      </div>
    </header>
  );
}