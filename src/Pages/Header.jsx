import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE } from "../config/api";

const Header = () => {
  const [form, setForm] = useState({
    hospitalName: "",
    address: "",
    email: "",
    phone: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async () => {
    if (!form.hospitalName || !form.address || !form.email || !form.phone) {
      toast.warning("Please fill all fields before saving header");
      return;
    }

    const formData = new FormData();
    formData.append("hospitalName", form.hospitalName);
    formData.append("address", form.address);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (image) formData.append("files", image);

    try {
      const res = await fetch(`${API_BASE}/api/header`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Header saved successfully!");
      } else {
        toast.error(data.message || "Failed to save header");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving header.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          PDF HEADER
        </h2>

        {/* Hospital Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            placeholder="Enter your Hospital Name"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your hospital address"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Upload Logo / Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-700"
          />
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-full border"
              />
            </div>
          )}
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

export default Header;
