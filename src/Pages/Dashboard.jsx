import React, { useEffect, useState } from "react";
import { API_BASE } from "../config/api";

const Dashboard = () => {
  const [totals, setTotals] = useState({
    patients: 0,
    drugs: 0,
    invoices: 0,
    appointments: 0,
    prescriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/entries`);
        const data = await res.json();

        if (data.success) {
          setTotals(data.totals);
          setToday(data.date);
        }
      } catch (err) {
        console.error("Error fetching entries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Dashboard</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Section */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Today's Summary</h2>
            <span className="text-gray-600 text-sm">
              {today ? `Entries for ${today}` : ""}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Patients</h3>
                <p className="text-3xl font-bold text-blue-900">{totals.patients}</p>
              </div>

              <div className="bg-green-100 border border-green-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-green-800 mb-2">Drugs</h3>
                <p className="text-3xl font-bold text-green-900">{totals.drugs}</p>
              </div>

              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Invoices</h3>
                <p className="text-3xl font-bold text-yellow-900">{totals.invoices}</p>
              </div>

              <div className="bg-purple-100 border border-purple-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Appointments</h3>
                <p className="text-3xl font-bold text-purple-900">{totals.appointments}</p>
              </div>

              <div className="bg-red-100 border border-red-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-red-800 mb-2">Prescriptions</h3>
                <p className="text-3xl font-bold text-red-900">{totals.prescriptions}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;