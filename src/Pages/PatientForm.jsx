import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_BASE } from "../config/api";

const PatientForm = () => {
  const location = useLocation();
  const { patientId } = location.state || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [diseases, setDiseases] = useState([
    "Diabetes",
    "High Blood Pressure",
    "High Cholesterol",
    "Heart Problems",
    "Asthma",
    "Kidney Disease",
    "Kidney Stones",
    "Jaundice",
    "Rheumatic Fever",
    "Cancer",
    "HIV/AIDS",
    "Blood Thinners",
    "Pregnancy",
  ]);
  const [newDisease, setNewDisease] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    mobile: "",
    dob: "",
    age: "",
    bloodGroup: "",
    gender: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    zip: "",
    medicalHistory: [],
    otherHistory: "",
  });
  const [message, setMessage] = useState("");
  const [setPatientId] = useState(null);
  const handleCheckboxChange = (condition) => {
    setForm((prev) => {
      if (prev.medicalHistory.includes(condition)) {
        return {
          ...prev,
          medicalHistory: prev.medicalHistory.filter((c) => c !== condition),
        };
      } else {
        return {
          ...prev,
          medicalHistory: [...prev.medicalHistory, condition],
        };
      }
    });
  };

  const generatePatientPDF = async (patientId) => {
    if (!patientId) {
      toast.error("Patient ID missing");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/generate-patient-pdf/${patientId}`,
        {
          method: "GET",
          headers: {
            /* any auth headers if needed */
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate invoice PDF");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch invoice PDF");
    }
  };

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!patientId) return; // Only run when patientId is known

      try {
        const res = await fetch(
          `${API_BASE}/api/patients/${patientId}/medical-history`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          if (data.data && data.data.length > 0) {
            // Map database records to your form state
            const diseaseList = data.data.map((item) => item.disease_name);
            const combinedHistory = data.data
              .map((item) => `${item.description}`)
              .join("\n");

            setForm((prev) => ({
              ...prev,
              medicalHistory: diseaseList,
              otherHistory: combinedHistory,
            }));

            setDiseases((prev) => {
              const newOnes = data.data
                .map((item) => item.disease_name)
                .filter((name) => !prev.includes(name));
              return [...prev, ...newOnes];
            });

            toast.info("Loaded existing medical history.");
          }
        } else {
          toast.warn(data.message || "No medical history found.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch medical history.");
      }
    };

    fetchMedicalHistory();
  }, [patientId]);

  const handleBasicSubmit = async () => {
    try {
      let url, method;

      if (patientId) {
        // 🟢 Update existing
        url = `${API_BASE}/api/update-patient/${patientId}`;
        method = "PUT";
      } else {
        // 🆕 Create new
        url = `${API_BASE}/api/create-patient`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.emailId,
          mobile: form.mobile,
          dob: form.dob,
          age: form.age,
          gender: form.gender,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (method === "POST") {
          setPatientId(data.patientId);
          toast.success("Patient created successfully!");
          setActiveTab("address");
        } else {
          toast.success("Patient info updated successfully!");
          setActiveTab("address");
        }
      } else {
        toast.error(data.message || "Failed to save patient info");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };


  const handleAddressSubmit = async () => {
    if (!patientId) {
      setMessage("Please save basic info first.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/add-address/${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressLine1: form.address1,
          addressLine2: form.address2,
          city: form.city,
          country: form.country,
          postalCode: form.zip,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // ✅ Clear only address fields
        setForm((prev) => ({
          ...prev,
          address1: "",
          address2: "",
          city: "",
          country: "",
          zip: "",
        }));

        // ✅ Move to Medical tab
        setActiveTab("medical");

        toast.success("Address saved successfully!");
      } else {
        setMessage(data.message || "Failed to save address.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to save address.");
    }
  };

  const handleMedicalSubmit = async () => {
    if (!patientId) {
      setMessage("Please save basic info first.");
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/add-medical-history/${patientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disease_name: form.medicalHistory,
            history: form.otherHistory,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        // ✅ Clear only medical history fields
        setForm((prev) => ({
          ...prev,
          medicalHistory: [],
          otherHistory: "",
        }));

        // ✅ Optionally go back to Basic Info or show completion message
        setActiveTab("basic");
        toast.success(
          "Medical history saved successfully! Patient record complete."
        );
      } else {
        setMessage(data.message || "Failed to save medical history.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to save medical history.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4">
      {/* Header */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Patient</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span
              onClick={() => navigate("/Patient")}
              className="hover:underline cursor-pointer"
            >
              Home
            </span>
            <span className="mx-1">›</span>
            <span>Patient</span>
            <span className="mx-1">›</span>
            <span>Add Paitent</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="bg-white">
          <div className="flex border-b border-gray-200">
            {[
              { key: "basic", label: "Basic Info" },
              { key: "address", label: "Address" },
              { key: "medical", label: "Medical History" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Id
                  </label>
                  <input
                    type="email"
                    value={form.emailId}
                    onChange={(e) =>
                      setForm({ ...form, emailId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile No
                  </label>
                  <input
                    type="text"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                              focus:outline-none focus:ring-1 focus:ring-blue-500 
                              focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={form.address1}
                    onChange={(e) =>
                      setForm({ ...form, address1: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={form.address2}
                    onChange={(e) =>
                      setForm({ ...form, address2: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal/Zip Code
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "medical" && (
            <div className="space-y-6">
              {/* Disease Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {diseases.map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.medicalHistory.includes(condition)}
                      onChange={() => handleCheckboxChange(condition)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>

              {/* Add New Disease Field */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a New Disease
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDisease}
                    onChange={(e) => setNewDisease(e.target.value)}
                    placeholder="Enter disease name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newDisease.trim();
                      if (!trimmed) {
                        toast.error("Please enter a valid disease name.");
                        return;
                      }
                      if (diseases.includes(trimmed)) {
                        toast.warning("Disease already exists.");
                        return;
                      }

                      // ✅ Add new disease
                      setDiseases((prev) => [...prev, trimmed]);

                      // ✅ Automatically check it in medical history
                      setForm((prev) => ({
                        ...prev,
                        medicalHistory: [...prev.medicalHistory, trimmed],
                      }));

                      setNewDisease("");
                      toast.success("Disease added and selected successfully!");
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Other History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other History
                </label>
                <textarea
                  rows={4}
                  value={form.otherHistory}
                  onChange={(e) =>
                    setForm({ ...form, otherHistory: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50"
                  placeholder=""
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 text-center">
            {activeTab === "basic" && (
              <button
                onClick={handleBasicSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save Basic Info
              </button>
            )}

            {activeTab === "address" && (
              <button
                onClick={handleAddressSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Save Address
              </button>
            )}

            {activeTab === "medical" && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleMedicalSubmit}
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Save Medical History
                </button>

                <button
                  onClick={() => generatePatientPDF(patientId)}
                  disabled={!patientId}
                  className={`${
                    patientId
                      ? "bg-gray-700 hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white px-6 py-2 rounded-md transition-colors text-sm font-medium`}
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
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
  );
};

export default PatientForm;
