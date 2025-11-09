import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import { toast } from "react-toastify";

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const generateAppointmentPDF = async (appointmentId) => {
    if (!appointmentId) {
      toast.error("Appointment ID missing");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/generate-appointment-pdf/${appointmentId}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to generate appointment PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch appointment PDF");
    }
  };

  // Fetch data with date range, search, pagination, etc.
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search,
          page,
          limit,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        }).toString();

        const res = await fetch(`${API_BASE}/api/get-appointment?${query}`);
        const data = await res.json();

        if (data.success) {
          setAppointments(data.data);
          setPagination(data.pagination);
        } else {
          setAppointments([]);
          setPagination({ totalRecords: 0, totalPages: 0 });
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [search, page, limit, startDate, endDate]);

  return (
    <div className="bg-gray-300 min-h-screen">
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Appointment</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Appointment</span>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header section */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            {/* Entries Select */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Right Controls */}
          <div className="flex flex-wrap gap-2 items-center justify-center md:justify-end">
            {/* Date Inputs */}
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
              />
              <span>—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Export Button */}
            <button className="flex items-center space-x-1 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1 rounded text-sm text-gray-700">
              <span>⬇</span>
              <span>Export</span>
            </button>

            {/* New Patient */}
            <button
              onClick={() => navigate("/appointment/form")}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              <span>+</span>
              <span>New Appointment</span>
            </button>
          </div>
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex justify-end items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by patient or doctor..."
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Doctor Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Appointment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Appointment Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500 text-sm">
                      No Data is available at the moment
                    </td>
                  </tr>
                ) : (
                  appointments.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{(page - 1) * limit + i + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.patientName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.doctorName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.appointment_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.appointmentDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <button
                          onClick={() => generateAppointmentPDF(p.appointment_id)}
                          className= "px-5 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-700">
            <span>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, pagination.totalRecords)} of{" "}
              {pagination.totalRecords} entries
            </span>
            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
