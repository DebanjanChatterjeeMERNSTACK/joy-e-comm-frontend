import { Home, Folder, BarChart2, LogOut, PackagePlus } from "lucide-react";
import { X } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Define all possible navigation items
const allNavItems = [
  { label: "Dashboard", icon: <Home size={20} />, href: "/", roles: ["admin", "superadmin"] },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  // Get user role from localStorage or your authentication system
  useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setUserRole(decoded.role);
        } catch (err) {
          console.error("Invalid token", err);
          setUserRole(null);
        }
      }
      
    }, []); // <- important: only run once on mount
  
    

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter nav items based on user role
  const getFilteredNavItems = () => {
    if (!userRole) return [];
    return allNavItems.filter(item => item.roles.includes(userRole));
  };

  // Check if current route matches or starts with the nav item's href
  const isActiveRoute = (href) => {
    return location.pathname === href || 
           (href !== "/" && location.pathname.startsWith(href));
  };

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-indigo-800 font-bold text-sm">
              {userRole === "superadmin" ? "SA" : "A"}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">MyPanel</h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden p-1 rounded-full hover:bg-indigo-700 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {getFilteredNavItems().map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <NavLink
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-white/10 text-white font-medium shadow-md"
                  : "text-indigo-100 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile when item is clicked
            >
              <span className={isActive ? "text-white" : "text-indigo-300"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-indigo-100 hover:bg-white/5 rounded-lg transition-colors text-left"
          aria-label="Logout"
        >
          <LogOut size={20} className="text-indigo-300" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}