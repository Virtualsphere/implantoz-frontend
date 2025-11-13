import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState([]);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [doctorQuery, setDoctorQuery] = useState("");
  const [doctorResults, setDoctorResults] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientMail: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "", // ✅ New field
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
      const fetchPatients = async () => {
        if (patientQuery.trim().length < 2) {
          setPatientResults([]);
          return;
        }
  
        try {
          const res = await fetch(
            `${API_BASE}/api/getPatientName/search?q=${patientQuery}`
          );
          const data = await res.json();
          setPatientResults(data.suggestions || []);
          setShowPatientSuggestions(true);
        } catch (err) {
          console.error("Error fetching patients:", err);
        }
      };
  
      const debounce = setTimeout(fetchPatients, 300);
      return () => clearTimeout(debounce);
    }, [patientQuery]);
  
    useEffect(()=> {
      const fetchDoctors= async()=>{
        if(doctorQuery.trim().length < 2){
          setDoctorResults([]);
          return;
        }
        try{
          const res= await fetch(
            `${API_BASE}/auth/get-name/search?q=${doctorQuery}`
          )
        const data = await res.json();
          setDoctorResults(data.suggestions || []);
          setShowDoctorSuggestions(true);
        } catch (err) {
          console.error("Error fetching patients:", err);
        }
      }
      const debounce = setTimeout(fetchDoctors, 300);
      return () => clearTimeout(debounce);
    }, [doctorQuery]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/create-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // ✅ appointmentTime will be included automatically
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          patientName: "",
          patientId: "",
          doctorId: "",
          appointmentDate: "",
          appointmentTime: "", // ✅ Reset field
        });
        toast.success("Appointment added successfully!");
      } else {
        toast.error(data.message || "Failed to save Appointment.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Appointment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <div className="bg-gray-300 px-6 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-normal text-black">Appointment</h1>
            <div className="flex items-center text-sm text-blue-600">
              <span onClick={() => navigate("/appointment")} className="hover:underline cursor-pointer">Home</span>
              <span className="mx-1">›</span>
              <span>Appointment</span>
              <span className="mx-1">›</span>
              <span>Add Appointment</span>
            </div>
          </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white">
          <div className="flex justify-center w-full border-b border-gray-200">
            <div className="p-6">
              <div className="space-y-6">
                {/* Patient Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={patientQuery || form.patientName}
                        onChange={(e) => {
                          setPatientQuery(e.target.value);
                          setForm({ ...form, patientName: e.target.value });
                        }}
                        onFocus={() => setShowPatientSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowPatientSuggestions(false), 200)
                        }
                        placeholder="Enter patient name"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {showPatientSuggestions && patientResults.length > 0 && (
                        <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-y-auto">
                          {patientResults.map((p) => (
                            <div
                              key={p.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onMouseDown={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  patientName: p.name,
                                  patientId: p.patient_id,
                                }));
                                setPatientQuery(p.name);
                                setShowPatientSuggestions(false);
                              }}
                            >
                              <p className="font-medium">{p.name}</p>
                              <p className="text-sm text-gray-500">{p.email}</p>
                              <p className="text-sm text-gray-500">{p.mobile}</p>
                              <p className="text-sm text-gray-500">{p.patient_id}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Id
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={form.patientId}
                        onChange={(e) =>
                          setForm({ ...form, patientId: e.target.value })
                        }
                        placeholder="Enter email address"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={doctorQuery || form.doctorId}
                        onChange={(e) => {
                          setDoctorQuery(e.target.value);
                          setForm({ ...form, doctorId: e.target.value });
                        }}
                        onFocus={() => setShowDoctorSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowDoctorSuggestions(false), 200)
                        }
                        placeholder="Enter patient name"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      {showDoctorSuggestions && doctorResults.length > 0 && (
                        <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-y-auto">
                          {doctorResults.map((p) => (
                            <div
                              key={p.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onMouseDown={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  doctorId: p.doctor_id,
                                }));
                                setDoctorQuery(p.name);
                                setShowDoctorSuggestions(false);
                              }}
                            >
                              <p className="font-medium">{p.name}</p>
                              <p className="text-sm text-gray-500">{p.email}</p>
                              <p className="text-sm text-gray-500">{p.mobile}</p>
                              <p className="text-sm text-gray-500">{p.doctor_id}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-user-md"></i>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={form.appointmentDate}
                        onChange={(e) =>
                          setForm({ ...form, appointmentDate: e.target.value })
                        }
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ Appointment Time Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={form.appointmentTime}
                        onChange={(e) =>
                          setForm({ ...form, appointmentTime: e.target.value })
                        }
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-clock"></i>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Save Appointment
                  </button>
                </div>

                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
