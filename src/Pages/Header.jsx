import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE } from "../config/api";

const Header = () => {
  const [form, setForm] = useState({
    hospitalName: "",
    address: "",
    email: "",
    phone: "",
    doctorName: "",
    location: "",
    speciality: "",
    type: "",
    degree: "",
    registeration_number: "",
  });

  // Separate states for logo and footer
  const [logo, setLogo] = useState(null);
  const [footer, setFooter] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [footerPreview, setFooterPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // Fetch existing header data
  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/header`);
        if (!res.ok) throw new Error("Failed to fetch header data");
        const data = await res.json();
        if (data && data[0]) {
          setForm({
            address: data[0].address || "",
            email: data[0].email || "",
            phone: data[0].number || "",
            doctorName: data[0].doctor_name || "",
            location: data[0].location || "",
            speciality: data[0].speciality || "",
            type: data[0].type || "",
            degree: data[0].degree || "",
            registeration_number: data[0].registeration_number || "",
          });

          // Set logo preview if exists
          if (data[0].image) {
            setLogoPreview(`${API_BASE}/uploads/${data[0].image}`);
          }

          // Set footer preview if exists
          if (data[0].footer) {
            setFooterPreview(`${API_BASE}/uploads/${data[0].footer}`);
          }
        }
      } catch (error) {
        console.error("Error fetching header:", error);
      }
    };

    fetchHeader();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFooterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFooter(file);
      setFooterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append non-empty form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          formData.append(key, value);
        }
      });

      // Append logo/footer if provided
      if (logo) formData.append("logo", logo);
      if (footer) formData.append("footer", footer);

      const res = await fetch(`${API_BASE}/api/header`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Header updated successfully!");
      } else {
        toast.error(data.message || "Failed to update header");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating header.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          PDF HEADER CONFIGURATION
        </h2>

        {/* Footer Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Upload Footer
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFooterChange}
            className="w-full text-sm text-gray-700"
          />
          {footerPreview && (
            <div className="mt-3 flex justify-center">
              <img
                src={footerPreview}
                alt="Footer Preview"
                className="h-24 object-contain border"
              />
            </div>
          )}
        </div>

        {/* Logo Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Upload Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full text-sm text-gray-700"
          />
          {logoPreview && (
            <div className="mt-3 flex justify-center">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-24 w-24 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        {/* Form Fields */}
        {[
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Doctor Name", name: "doctorName", type: "text" },
          { label: "Location", name: "location", type: "text" },
          { label: "Speciality", name: "speciality", type: "text" },
          { label: "Type", name: "type", type: "text" },
          { label: "Degree", name: "degree", type: "text" },
          {
            label: "Registration Number",
            name: "registeration_number",
            type: "text",
          },
        ].map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block text-gray-700 text-sm mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Header"}
        </button>

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
};

export default Header;
