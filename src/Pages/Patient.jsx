import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const Patient = () => {
  const navigate = useNavigate();
  const [ patients, setPatient ]= useState([]);
  const [ loading, setLoading ]= useState(true);
  useEffect(()=>{
    const fetchPatient= async()=>{
      try {
        const res= await fetch("");
        const data= await res.json();
        setPatient(data);
      } catch (error) {
        console.error("Error Featching prescription:", err);
      } finally{
        setLoading(false);
      }
    }
    fetchPatient();
  }, []);
  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header Section */}
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

      {/* Main Content Card */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Table Header Controls */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
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
                <button onClick={() => navigate("/patient/form")} className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    <span>+</span>
                    <span>New Patient</span>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Date Of Birth</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Blood group</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-300">Created on</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-gray-500 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-gray-500 text-sm">
                      No Data is available at the moment
                    </td>
                  </tr>
                ) : (
                  patients.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-sm text-gray-700">{i + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.patientName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.gender}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.dateOfBirth}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.bloodGroup}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.createdOn}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="text-sm text-gray-700">
              Showing 0 to 0 of 0 entries
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Patient;