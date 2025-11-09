import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from '../config/api';
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
  Menu,
  X,
} from "lucide-react";
import Logo from "../assets/logo.png";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettingsBox, setShowSettingsBox] = useState(false);

  // 🆕 Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showUserBox, setShowUserBox] = useState(false);
  const userName = localStorage.getItem("name") || "User";

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Patient", path: "/patient", icon: <Users className="h-5 w-5" /> },
    { name: "Appointment", path: "/appointment", icon: <Calendar className="h-5 w-5" /> },
    { name: "Prescription", path: "/prescription", icon: <FileText className="h-5 w-5" /> },
    { name: "Invoicing", path: "/invoicing", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Drugs", path: "/drugs", icon: <Pill className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/"); // redirect to login
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem("name", data.user.name);
          } else {
            handleLogout();  // Invalid token, logout
          }
        })
        .catch(() => handleLogout());
    }
  }, []);

  // 🧠 Fetch patient data when searchQuery changes
  useEffect(() => {
    const fetchPatients = async () => {
      if (searchQuery.trim().length === 0) {
        setPatients([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/getPatientName/search?q=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPatients(data.suggestions); // Expecting array of patients from backend
          setShowResults(true);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error(err);
        setPatients([]);
      }
    };

    const delayDebounce = setTimeout(fetchPatients, 400); // 🕒 debounce typing
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#1e3a5f] text-white flex flex-col w-64
          md:relative md:translate-x-0
          fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-600">
          <img src={Logo} alt="Implantoz Logo" className="h-14" />
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
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
              onClick={() => setIsSidebarOpen(false)}
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
      <div className="flex-1 flex flex-col relative">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b shadow relative">
          {/* Left side: Hamburger + Search */}
          <div className="flex items-center space-x-3 relative">
            <button className="md:hidden text-gray-700" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            {/* Search box */}
            <div className="relative flex items-center bg-white px-3 py-1 rounded shadow-sm flex-1 max-w-lg">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Patient"
                className="ml-2 outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
              />

              {/* 🧩 Search results dropdown */}
              {showResults && patients.length > 0 && (
                <div className="absolute top-10 left-0 w-full bg-white shadow-lg rounded-md border border-gray-200 z-50 max-h-60 overflow-y-auto">
                  {patients.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
                      /*onClick={() => {
                        navigate(`/patient/${p.id}`); // 🧭 Go to patient details
                        setSearchQuery("");
                        setShowResults(false);
                      }}*/
                    >
                      <span>{p.name}</span>
                      <span className="text-gray-500">#{p.id}</span>
                      <span className="text-gray-500 text-xs">{p.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 text-gray-700">
            <Home className="h-5 w-5 cursor-pointer" onClick={() => navigate("/")} />
            {/* ⚙️ Settings dropdown */}
            <div className="relative">
              <Settings
                className="h-5 w-5 cursor-pointer"
                onClick={() => setShowSettingsBox((prev) => !prev)}
              />

              {showSettingsBox && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50 p-2">
                  <button
                    onClick={() => {
                      navigate("/header/form");
                      setShowSettingsBox(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    Header
                  </button>
                  <button
                    onClick={() => {
                      navigate("/footer/form");
                      setShowSettingsBox(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    Footer
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <User
                className="h-5 w-5 cursor-pointer"
                onClick={() => setShowUserBox((prev) => !prev)}
              />

              {showUserBox && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50 p-4">
                  <p className="text-sm font-semibold mb-2">{userName}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-1 rounded-md text-sm hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
