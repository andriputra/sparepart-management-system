import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiFileText, FiHome, FiSliders, FiCpu } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Document Create", path: "/document-create", icon: <FiFileText /> },
    { name: "Spare Part List", path: "/sparepart-list", icon: <FiSliders/> },
    { name: "Settings", path: "/settings", icon: <FiCpu /> },
  ];

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h1 className={`text-lg font-bold ${collapsed ? "hidden" : "block"}`}>
          Sparepart System
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4">
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
              location.pathname === menu.path
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {menu.icon}
            {!collapsed && <span>{menu.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:bg-red-600 hover:text-white border-t border-gray-700"
      >
        <FiLogOut />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
}