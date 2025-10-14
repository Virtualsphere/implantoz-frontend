import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Invoicing = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/invoices?search=${search}&page=${page}&limit=${limit}`
        );
        const data = await res.json();

        if (data.success) {
          setInvoices(data.data);
          setPagination(data.pagination);
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
  }, [search, page, limit]);

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Invoices</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Invoices</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header Controls */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            {/* Entries Selector */}
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
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span>12-07-2025</span>
                  <span>—</span>
                  <span>12-08-2025</span>
                </div>
                <button className="flex items-center space-x-1 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1 rounded text-sm text-gray-700">
                  <span>⬇</span>
                  <span>Export</span>
                </button>
              <button
                onClick={() => navigate("/invoicing/form")}
                className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                <span>+</span>
                <span>New Invoice</span>
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
                  placeholder="Search by patient, doctor, invoice..."
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Invoice Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Created Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-gray-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-gray-500 text-sm">
                      No data available
                    </td>
                  </tr>
                ) : (
                  invoices.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{(page - 1) * limit + i + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.patient_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">${p.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.invoice_date}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.created_at}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.due_date}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">{p.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-700">
            <span>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, pagination.totalRecords)} of{" "}
              {pagination.totalRecords} entries
            </span>

            {/* Simple Pagination */}
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

export default Invoicing;
