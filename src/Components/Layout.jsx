import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Pill,
  Search,
  Settings,
  User,
} from "lucide-react";
import Logo from "../assets/logo.png";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Patient", path: "/patient", icon: <Users className="h-5 w-5" /> },
    {
      name: "Appointment",
      path: "/appointment",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Prescription",
      path: "/prescription",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Invoicing",
      path: "/invoicing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    { name: "Drugs", path: "/drugs", icon: <Pill className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e3a5f] text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center space-x-2 border-b border-gray-600">
          <img src={Logo} alt="Implantoz Logo" className="h-14" />
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-2 py-2 rounded-md ${
                location.pathname === item.path
                  ? "bg-black text-white"
                  : "hover:text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-center border-t border-gray-600">
          Powered by Virtualsphere Technologies Pvt Ltd
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b shadow">
          {/* Search */}
          <div className="flex items-center bg-white px-3 py-1 rounded shadow-sm w-1/3">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Patient"
              className="ml-2 outline-none w-full text-sm"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 text-gray-700">
            <Home
              className="h-5 w-5 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <Settings className="h-5 w-5 cursor-pointer" />
            <User className="h-5 w-5 cursor-pointer" />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
