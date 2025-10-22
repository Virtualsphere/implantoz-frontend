import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Patient = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [search, setSearch] = useState("");


  const generatePatientPDF = async (patientId) => {
        if (!patientId) {
          toast.error("Invoice ID missing");
          return;
        }
    
        try {
          const response = await fetch(`http://103.118.16.129:5009/api/generate-patient-pdf/${patientId}`, {
            method: 'GET',
            headers: { /* any auth headers if needed */ }
          });
          if (!response.ok) {
            throw new Error('Failed to generate invoice PDF');
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch invoice PDF');
      }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://103.118.16.129:5009/api/getPatients?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        );
        const data = await res.json();

        if (data.success) {
          setPatients(data.patients || []);
          setTotalPages(data.totalPages || 1);
          setTotalPatients(data.totalPatients || 0);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page, limit, search]); // refetch when these change

  // handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // handle search with small delay (debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1); // reset to first page when searching
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Patients</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Patient</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Top Controls */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1); // reset when limit changes
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

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
                onClick={() => navigate("/patient/form")}
                className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                <span>+</span>
                <span>New Patient</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex justify-end items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name..."
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Patient Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Date of Birth</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Blood Group</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300">Created On</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-300"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500 text-sm">
                      No data available
                    </td>
                  </tr>
                ) : (
                  patients.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">{(page - 1) * limit + i + 1}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.first_name} {p.last_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.gender}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.dob}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.blood_group}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{p.created_at}</td>
                      <td>
                        <button
                          onClick={() => generatePatientPDF(p.patient_id)}
                          className={`${
                            p.patient_id ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
                          } text-white px-6 py-2 rounded-md transition-colors text-sm font-medium`}
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{" "}
              {patients.length > 0
                ? `${(page - 1) * limit + 1} to ${(page - 1) * limit + patients.length} of ${totalPatients}`
                : "0"}{" "}
              entries
            </div>

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className={`px-3 py-1 border rounded text-sm ${
                  page <= 1 ? "text-gray-400 border-gray-200" : "text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`px-3 py-1 border rounded text-sm ${
                  page >= totalPages ? "text-gray-400 border-gray-200" : "text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
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

export default Patient;
