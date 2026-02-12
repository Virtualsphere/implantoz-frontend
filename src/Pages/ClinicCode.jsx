import React, { useState } from "react";
import { API_BASE } from "../config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClinicCode() {
  const [form, setForm] = useState({
    clinicName: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/clinic/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({
          clinicName: "",
          address: "",
        });

        toast.success(
          `Clinic added successfully! Code: ${data.clinicCode}`
        );
      } else {
        toast.error(data.message || "Failed to save clinic.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save clinic.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Clinic Code
        </h1>

        {/* ✅ Submit handled here */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic Name
            </label>
            <input
              type="text"
              value={form.clinicName}
              onChange={(e) =>
                setForm({ ...form, clinicName: e.target.value })
              }
              placeholder="Enter clinic name"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              placeholder="Enter address"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-xl py-2 font-medium hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </div>
  );
}
