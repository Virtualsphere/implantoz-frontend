import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AppointmentForm = () => {
  const [appointment, setAppointment] = useState([]);
    const [form, setForm] = useState({
      patientName: "",
      patientMail: "",
      doctorName: "",
      appointmentDate: ""
    });
    const [message, setMessage]= useState("");
  
    const handleSubmit = async () => {
      try {
        const res= await fetch("/api/create-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok){
        setForm({ patientName: "", patientMail: "", doctorName: "", appointmentDate: "" });
        toast.success("Appointment added successfully!");
      }else{
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Appointment
          </h1>
          <p className="text-sm text-gray-600">
            <span
              onClick={() => navigate("/appointment")}
              className="hover:underline cursor-pointer"
            >
              Home
            </span>{" "}
            › <span className="text-blue-600">Appointment</span> › Add
            Appointment
          </p>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white">
          <div className="flex justify-center w-full border-b border-gray-200">
            <div className="p-6">
              <div className="space-y-6">
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
                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
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
                        onChange={(e) => setForm({ ...form, patientMail: e.target.value })}
                        placeholder="Enter email address"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-envelope"></i>
                    </span>
                    </div>
                </div>
                </div>
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
                        onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
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
                        onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        <i className="fas fa-calendar"></i>
                    </span>
                    </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save Drug
                </button>
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
    </div>
  );
};

export default AppointmentForm;
