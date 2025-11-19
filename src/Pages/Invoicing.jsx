import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Invoicing = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // 🔹 NEW: status filter
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const generateInvoicePDF = async (invoiceId) => {
    if (!invoiceId) return alert("Invoice ID missing");
    try {
      const response = await fetch(`${API_BASE}/api/generate-invoice-pdf/${invoiceId}`);
      if (!response.ok) throw new Error("Failed to generate invoice PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch invoice PDF");
    }
  };

  const sendMessage= async (invoiceId)=>{
    if(!invoiceId) return toast.error("Invoice ID missing");
    try {
      const response = await fetch(`${API_BASE}/api/send-message/${invoiceId}`);
      if (response.ok){
        toast.success("Message send Successfully");
      }else{
        toast.error("Failed to Send invoice PDF");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to Send invoice PDF");
    }
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          page,
          limit,
        });
        if (status) params.append("status", status); // ✅ correct param
        if (startDate) params.append("startDate", startDate); // ✅ correct casing
        if (endDate) params.append("endDate", endDate);

        const res = await fetch(`${API_BASE}/api/invoices?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setInvoices(data.data || []);
          setPagination(data.pagination || { totalRecords: 0, totalPages: 0 });
        } else {
          setInvoices([]);
          setPagination({ totalRecords: 0, totalPages: 0 });
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [search, page, limit, startDate, endDate, status]); // ✅ added status dependency

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header */}
      <div className="bg-gray-300 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-normal text-black">Invoices</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span onClick={() => navigate("/")} className="hover:underline cursor-pointer">
              Home
            </span>
            <span className="mx-1">›</span>
            <span>Invoices</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="px-3 sm:px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Top Controls */}
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

              {/* 🔹 Status Filter */}
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="complete">Complete</option>
                <option value="pending">Pending</option>
              </select>

              {/* Export Button */}
              <button className="flex items-center space-x-1 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1 rounded text-sm text-gray-700">
                <span>⬇</span>
                <span>Export</span>
              </button>

              {/* New Invoice */}
              <button
                onClick={() => navigate("/invoicing/form")}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                <span>+</span>
                <span>New Invoice</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="flex justify-end">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-sm text-gray-700">Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by patient, doctor, invoice..."
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Invoice Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Due</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-gray-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-gray-500 text-sm">
                      No data available
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv, i) => (
                    <tr key={inv.invoice_id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">{(page - 1) * limit + i + 1}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{inv.patient_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{inv.amount?.toFixed(2)} rs</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{inv.invoice_date}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{inv.created_at}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{inv.due_date}</td>
                      <td className="px-6 py-3 text-sm text-gray-700 capitalize">{inv.status}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <button
                          onClick={() => generateInvoicePDF(inv.invoice_id)}
                          className="px-5 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded"
                        >
                          Download
                        </button>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <button
                          onClick={() => sendMessage(inv.invoice_id)}
                          className="px-5 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          Send
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700 gap-2">
            <span>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.totalRecords)} of{" "}
              {pagination.totalRecords} entries
            </span>
            <div className="flex space-x-2">
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
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Invoicing;
