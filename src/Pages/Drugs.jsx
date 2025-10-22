import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Drugs = () => {
    const navigate = useNavigate();
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });

    const generateDrugPDF = async (drugId) => {
        if (!drugId) {
          toast.error("Drug ID missing");
          return;
        }
    
        try {
          const response = await fetch(`http://103.118.16.129:5009/api/generate-drug-pdf/${drugId}`, {
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
        const fetchDrugs = async () => {
          setLoading(true);
          try {
            const res = await fetch(
              `http://103.118.16.129:5009/api/get-drug?search=${search}&page=${page}&limit=${limit}`
            );
            const data = await res.json();
            if (data.success) {
              setDrugs(data.data);
              setPagination(data.pagination);
            } else {
              setDrugs([]);
              setPagination({ totalRecords: 0, totalPages: 0 });
            }
          } catch (err) {
            console.error("Error fetching invoices:", err);
          } finally {
            setLoading(false);
          }
        };
          fetchDrugs();
      }, [search, page, limit]);
    return (
      <div className="bg-gray-300 min-h-screen">
        {/* Header Section */}
        <div className="bg-gray-300 px-6 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-normal text-black">Drug</h1>
            <div className="flex items-center text-sm text-blue-600">
              <span className="hover:underline cursor-pointer">Home</span>
              <span className="mx-1">›</span>
              <span>Drugs</span>
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
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
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
                  <button onClick={() => navigate("/drugs/form")} className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    <span>+</span>
                    <span>New Drugs</span>
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
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Medicine</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Company Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Unit</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Unit/Packaging</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">PTS</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">PTR</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center text-gray-500 text-sm">
                        Loading...
                      </td>
                    </tr>
                  ) : drugs.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-16 text-center text-gray-500 text-sm">
                        No Data is available at the moment
                      </td>
                    </tr>
                  ) : (
                    drugs.map((d, i) => (
                      <tr key={d.id} className="border-b border-gray-200">
                        <td className="px-6 py-4 text-sm text-gray-700">{i + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.drug_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.company_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.unit_packaging}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.pts}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{d.ptr}</td>
                        <td>
                        <button
                          onClick={() => generateDrugPDF(d.drug_id)}
                          className={`${
                            d.drug_id ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
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

export default Drugs