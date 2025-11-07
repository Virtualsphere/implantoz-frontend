import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState([]);
  const [form, setForm] = useState({
    patientName: "",
    patientMail: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "", // ✅ New field
  });
  const [message, setMessage] = useState("");

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
          patientMail: "",
          doctorName: "",
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
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={form.patientName}
                        onChange={(e) =>
                          setForm({ ...form, patientName: e.target.value })
                        }
                        placeholder="Enter patient name"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Mail Id
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={form.patientMail}
                        onChange={(e) =>
                          setForm({ ...form, patientMail: e.target.value })
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
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={form.doctorName}
                        onChange={(e) =>
                          setForm({ ...form, doctorName: e.target.value })
                        }
                        placeholder="Enter doctor name"
                      />
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
