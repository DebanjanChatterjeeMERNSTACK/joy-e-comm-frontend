import { Home, Settings, User, LogOut, Folder, BarChart2, HelpCircle } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <Home size={20} />, href: "#" },
  { label: "Projects", icon: <Folder size={20} />, href: "#" },
  { label: "Analytics", icon: <BarChart2 size={20} />, href: "#" },
  { label: "Profile", icon: <User size={20} />, href: "#" },
  { label: "Settings", icon: <Settings size={20} />, href: "#" },
  { label: "Support", icon: <HelpCircle size={20} />, href: "#" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate=useNavigate()
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handlelogout=()=>{
     localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="h-full bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-indigo-800 font-bold text-sm">MP</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">MyPanel</h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden p-1 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActiveItem(item.label)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeItem === item.label
                ? "bg-white/10 text-white font-medium shadow-md"
                : "text-indigo-100 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={`${activeItem === item.label ? "text-white" : "text-indigo-300"}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {activeItem === item.label && (
              <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <div className="flex items-center gap-3 px-4 py-2 text-indigo-100 hover:bg-white/5 rounded-lg transition-colors cursor-pointer" onClick={handlelogout}>
          <LogOut size={20} className="text-indigo-300" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}