// Updated styled Drug Form matching Invoice UI
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DrugsForm= ()=> {
  const [form, setForm] = useState({
    drugName: "",
    companyName: "",
    unit: "",
    unitPackaging: "",
    category: "",
    pts: "",
    ptr: ""
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/create-drug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ drugName: "", companyName: "", unit: "", unitPackaging: "", category: "", pts: "", ptr: "" });
        toast.success("Drug added successfully!");
      } else {
        toast.error(data.message || "Failed to save drug.");
      }
    } catch (error) {
      toast.error("Failed to save drug.");
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen">
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Drug</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span onClick={() => navigate("/prescription")} className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Drug</span>
            <span className="mx-1">›</span>
            <span>Add Drug</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-3 gap-6">
            {Object.entries({ DrugName: "drugName", Company: "companyName", Unit: "unit", Packaging: "unitPackaging", Category: "category", PTS: "pts", PTR: "ptr" }).map(([label, key], i) => (
              <div key={i}>
                <label className="block text-sm text-gray-700 mb-2">{label}</label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Enter ${label}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex space-x-3">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm"
            >
              Save Drug
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DrugsForm;
