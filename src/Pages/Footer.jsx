import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE } from '../config/api';
const Footer = () => {
  const [form, setForm] = useState({
    description: ""
  });
  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Handle OTP request
  const handleSubmit = async () => {
    if (!form.description) {
      toast.warning("Please fill all fields Saving Footer");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/footer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Footer Saved Successfully");
      } else {
        toast.error(data.message || "Failed to Save Footer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving footer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Footer
        </h2>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter your description"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Save
        </button>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
};
export default Footer;