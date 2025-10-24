import React, { useEffect, useState, useRef  } from 'react'
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Prescription = () => {
  const pdfRef= useRef();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });

  const [pdfData, setPdfData] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
  });

  const generatePDF = async (prescriptionId) => {
    try {
      const res = await fetch(`/api/generate-prescription-pdf/${prescriptionId}`, {
        method: 'GET'
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate PDF');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // open in new tab (preview)
      window.open(url, '_blank');

      // optional: revoke object URL after some delay
      setTimeout(() => window.URL.revokeObjectURL(url), 60 * 1000);
    } catch (err) {
      console.error('Error fetching PDF:', err);
      alert('Failed to generate preview PDF');
    }
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/getPrescription?search=${search}&page=${page}&limit=${limit}`
        );
        const data = await res.json();

        if (data.success) {
          setPrescriptions(data.data);
          setPagination(data.pagination);
        } else {
          setPrescriptions([]);
          setPagination({ totalRecords: 0, totalPages: 0 });
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [search, page, limit]);
  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Prescriptions</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Prescriptions</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Table Header Controls */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}>
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
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
                <button onClick={() => navigate("/prescription/form")} className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  <span>+</span>
                  <span>New Prescriptions</span>
                </button>
              </div>
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
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Patient Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Doctor Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Consultation Id</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-gray-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : prescriptions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-gray-500 text-sm">
                      No Data is available at the moment
                    </td>
                  </tr>
                ) : (
                  prescriptions.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-sm text-gray-700">{(page - 1) * limit + i + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.patientName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.doctorName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.prescription_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700"><button onClick={() => generatePDF(p.prescription_id)}
                        className="px-6 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded">
                        Dowload
                        </button>
                      </td>
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
  )
}

export default Prescription
