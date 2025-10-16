import React, { useState } from "react";
import { Calendar } from "lucide-react";
import ToothIcon from "../assets/tooth.png";

const PrescriptionForm = () => {
  const [activeTab, setActiveTab] = useState("Chief Complaint");
  const [examinationInput, setExaminationInput] = useState("");
  const [investigationInput, setInvestigationInput] = useState("");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [treatmentPlanInput, setTreatmentPlanInput] = useState("");
  const [procedureInput, setProcedureInput] = useState("");
  const [adviceInstructiosInput, setAdviceInstructionInput] = useState("");
  const [addedItems, setAddedItems] = useState("");
  const [treatmentDate, setTreatmentDate] = useState("");
  const [treatmentAmount, setTreatmentAmount] = useState("");
  const [treatmentTeeth, setTreatmentTeeth] = useState("");

  const [examinations, setExaminations] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [adviceInstructions, setAdviceInstructions] = useState([]);

  const [form, setForm] = useState({
    doctorName: "",
    patientMail: "",
    patientName: "",
    teethSpecification: "",
    chiefComplaint: "",
    examination: [],
    investigation: [],
    diagnosis: [],
    treatmentPlan: [],
    procedure: [],
    medication: [],
    adviceInstruction: [],
  });

  const [message, setMessage] = useState("");

  const API_ENDPOINTS = {
    "Chief Complaint": "/api/prescription-complaint",
    Examination: "/api/prescription-examination",
    "Investigation / Finding": "/api/prescription-investigation",
    Diagnosis: "/api/prescription-diagnosis",
    "Treatment Plan": "/api/prescription-treatment-plan",
    Procedure: "/api/prescriptions/procedure",
    Medication: "/api/prescription/medication",
    "Advice Instructions": "/api/prescription/advice-instruction",
  };

  const handleSubmit = async (e) => {
    try {
      const endpoint = API_ENDPOINTS[activeTab];
      if (!endpoint) {
        setMessage("No API endpoint for this tab");
        return;
      }

      let basePayload = {
        doctorName: form.doctorName,
        patientMail: form.patientMail,
        patientName: form.patientName,
        teethSpecification: form.teethSpecification,
      };

      let basePayloadWithoutTheet = {
        doctorName: form.doctorName,
        patientMail: form.patientMail,
        patientName: form.patientName,
      };

      // Pick only relevant part of the form for this tab
      let payload = {};
      switch (activeTab) {
        case "Chief Complaint":
          payload = {
            ...basePayloadWithoutTheet,
            chiefComplaint: form.chiefComplaint,
          };
          break;

        case "Examination":
          payload = { ...basePayload, examination: form.examination };
          break;

        case "Investigation / Finding":
          payload = { ...basePayload, investigation: form.investigation };
          break;

        case "Diagnosis":
          payload = { ...basePayload, diagnosis: form.diagnosis };
          break;

        case "Treatment Plan":
          payload = { ...basePayloadWithoutTheet, treatmentPlan: form.treatmentPlan };
          break;

        case "Procedure":
          payload = { ...basePayload, procedure: form.procedure };
          break;

        case "Medication":
          payload = { ...basePayloadWithoutTheet, medication: form.medication };
          break;

        case "Advice Instructions":
          payload = {
            ...basePayload,
            adviceInstruction: form.adviceInstruction,
          };
          break;

        default:
          break;
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || "Saved successfully");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const tabs = [
    "Chief Complaint",
    "Examination",
    "Investigation / Finding",
    "Diagnosis",
    "Treatment Plan",
    "Procedure",
    "Medication",
    "Advice Instructions",
  ];

  const handleAddTreatmentPlan = () => {
    if (
      !treatmentPlanInput.trim() &&
      !treatmentTeeth.trim() &&
      !treatmentDate &&
      !treatmentAmount
    )
      return;

    const newItem = {
      procedure: treatmentPlanInput.trim(),
      teethSpecification: treatmentTeeth.trim(),
      date: treatmentDate,
      amount: treatmentAmount,
    };

    const newItems = [...treatmentPlans, newItem];
    setTreatmentPlans(newItems);
    setForm((prev) => ({ ...prev, treatmentPlan: newItems }));

    // Reset inputs
    setTreatmentPlanInput("");
    setTreatmentTeeth("");
    setTreatmentDate("");
    setTreatmentAmount("");
  };

  const handleAdd = (input, setInput, items, setItems, key) => {
    if (input.trim()) {
      const newItems = [...items, input.trim()];
      setItems(newItems);

      // Update form dynamically
      setForm((prev) => ({ ...prev, [key]: newItems }));

      setInput("");
    }
  };

  // Remove item
  const handleRemove = (index, items, setItems, key) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    setForm((prev) => ({ ...prev, [key]: newItems }));
  };

  // Clear all
  const handleClear = (setItems, key) => {
    setItems([]);
    setForm((prev) => ({ ...prev, [key]: [] }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Chief Complaint":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-4">
                Chief Complaint
              </label>
              <textarea
                rows={6}
                value={form.chiefComplaint}
                onChange={(e) =>
                  setForm({ ...form, chiefComplaint: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "Examination":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Teeth Specification
                </label>
                <div className="flex items-center space-x-2 relative">
                  <img
                    src={ToothIcon}
                    alt="tooth"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={form.teethSpecification}
                    onChange={(e) =>
                      setForm({ ...form, teethSpecification: e.target.value })
                    }
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Add Examinations
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={examinationInput}
                  onChange={(e) => setExaminationInput(e.target.value)}
                  placeholder="Add Examinations"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    handleAdd(
                      examinationInput,
                      setExaminationInput,
                      examinations,
                      setExaminations,
                      "examination"
                    )
                  }
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {examinations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added
                  </span>
                  <button
                    onClick={() => handleClear(setExaminations, "examination")}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {examinations.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        onClick={() =>
                          handleRemove(
                            index,
                            examinations,
                            setExaminations,
                            "examination"
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Quick Type
              </label>
              <div className="flex space-x-2">
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Periodontitis
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Infections
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Apical Periodontitis
                </button>
              </div>
            </div>
          </div>
        );

      case "Investigation / Finding":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Teeth Specification
                </label>
                <div className="flex items-center space-x-2 relative">
                  <img
                    src={ToothIcon}
                    alt="tooth"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={form.teethSpecification}
                    onChange={(e) =>
                      setForm({ ...form, teethSpecification: e.target.value })
                    }
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Add Investigation
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={investigationInput}
                  onChange={(e) => setInvestigationInput(e.target.value)}
                  placeholder="Add investigation..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    handleAdd(
                      investigationInput,
                      setInvestigationInput,
                      investigations,
                      setInvestigations,
                      "investigation"
                    )
                  }
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {investigations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added
                  </span>
                  <button
                    onClick={() =>
                      handleClear(setInvestigations, "investigation")
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {investigations.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        onClick={() =>
                          handleRemove(
                            index,
                            investigations,
                            setInvestigations,
                            "investigation"
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Quick Type
              </label>
              <div className="flex space-x-2">
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Missing Teeth
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Sensitivity
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Bleeding gums
                </button>
              </div>
            </div>
          </div>
        );

      case "Diagnosis":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Teeth Specification
                </label>
                <div className="flex items-center space-x-2 relative">
                  <img
                    src={ToothIcon}
                    alt="tooth"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={form.teethSpecification}
                    onChange={(e) =>
                      setForm({ ...form, teethSpecification: e.target.value })
                    }
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Add Diagnosis
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={diagnosisInput}
                  onChange={(e) => setDiagnosisInput(e.target.value)}
                  placeholder="Add diagnosis..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    handleAdd(
                      diagnosisInput,
                      setDiagnosisInput,
                      diagnoses,
                      setDiagnoses,
                      "diagnosis"
                    )
                  }
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {diagnoses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added
                  </span>
                  <button
                    onClick={() => handleClear(setDiagnoses, "diagnosis")}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {diagnoses.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        onClick={() =>
                          handleRemove(
                            index,
                            diagnoses,
                            setDiagnoses,
                            "diagnosis"
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Quick Type
              </label>
              <div className="flex space-x-2">
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Missing Teeth
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Sensitivity
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Bleeding gums
                </button>
              </div>
            </div>
          </div>
        );

      case "Treatment Plan":
        return (
          <div className="space-y-6">
            {/* Patient details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Teeth Specification
                </label>
                <div className="flex items-center space-x-2 relative">
                  <img
                    src={ToothIcon}
                    alt="tooth"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  />
                  <input
                    type="text"
                    value={treatmentTeeth}

                    onChange={(e) => setTreatmentTeeth(e.target.value)}
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Treatment entry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Procedure Details
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={treatmentPlanInput}
                    onChange={(e) => setTreatmentPlanInput(e.target.value)}
                    placeholder="Procedure details..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTreatmentPlan}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <input
                  type="date"
                  value={treatmentDate}
                  onChange={(e) => setTreatmentDate(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={treatmentAmount}
                  onChange={(e) => setTreatmentAmount(e.target.value)}
                  placeholder="Amount"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List of added treatments */}
            {treatmentPlans.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added Treatments
                  </span>
                  <button
                    onClick={() =>
                      handleClear(setTreatmentPlans, "treatmentPlan")
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {treatmentPlans.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>Procedure:</strong> {item.procedure}
                        </div>
                        <div>
                          <strong>Teeth:</strong> {item.teethSpecification}
                        </div>
                        <div>
                          <strong>Date:</strong> {item.date}
                        </div>
                        <div>
                          <strong>Amount:</strong> {item.amount}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleRemove(
                            index,
                            treatmentPlans,
                            setTreatmentPlans,
                            "treatmentPlan"
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "Medication":
        return (
          <div className="space-y-6">
            {/* Common Patient Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Medication Table */}
            <div className="space-y-4">
              <div className="overflow-x-auto border border-gray-200 rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Drug Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Generic
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Frequency
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Duration
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Instruction
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {form.medication.length > 0 ? (
                      form.medication.map((med, index) => (
                        <tr key={index} className="bg-white">
                          {/* Drug Name */}
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={med.drugName}
                              onChange={(e) => {
                                const updated = [...form.medication];
                                updated[index].drugName = e.target.value;
                                setForm({ ...form, medication: updated });
                              }}
                              placeholder="Medicine Name"
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>

                          {/* Generic */}
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={med.generic}
                              onChange={(e) => {
                                const updated = [...form.medication];
                                updated[index].generic = e.target.value;
                                setForm({ ...form, medication: updated });
                              }}
                              placeholder="Generic"
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>

                          {/* Frequency Dropdown */}
                          <td className="px-4 py-2">
                            <select
                              value={med.frequency}
                              onChange={(e) => {
                                const updated = [...form.medication];
                                updated[index].frequency = e.target.value;
                                setForm({ ...form, medication: updated });
                              }}
                              className="w-full border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="1-0-0">1-0-0</option>
                              <option value="1-1-0">1-1-0</option>
                              <option value="1-1-1">1-1-1</option>
                              <option value="0-1-0">0-1-0</option>
                              <option value="0-0-1">0-0-1</option>
                            </select>
                          </td>

                          {/* Duration Dropdown */}
                          <td className="px-4 py-2">
                            <select
                              value={med.duration}
                              onChange={(e) => {
                                const updated = [...form.medication];
                                updated[index].duration = e.target.value;
                                setForm({ ...form, medication: updated });
                              }}
                              className="w-full border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="1 Day">1 Day</option>
                              <option value="3 Days">3 Days</option>
                              <option value="5 Days">5 Days</option>
                              <option value="7 Days">7 Days</option>
                              <option value="14 Days">14 Days</option>
                            </select>
                          </td>

                          {/* Instruction */}
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={med.instruction}
                              onChange={(e) => {
                                const updated = [...form.medication];
                                updated[index].instruction = e.target.value;
                                setForm({ ...form, medication: updated });
                              }}
                              placeholder="Instruction"
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>

                          {/* Remove Button */}
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => {
                                const updated = form.medication.filter(
                                  (_, i) => i !== index
                                );
                                setForm({ ...form, medication: updated });
                              }}
                              className="text-red-500 hover:text-red-700 font-semibold text-lg"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-gray-400 text-sm py-4"
                        >
                          No medicines added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Medicine Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const newMed = {
                      drugName: "",
                      generic: "",
                      frequency: "",
                      duration: "",
                      instruction: "",
                    };
                    setForm({
                      ...form,
                      medication: [...form.medication, newMed],
                    });
                  }}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  + Add Medicine
                </button>
              </div>
            </div>
          </div>
        );

      case "Advice Instructions":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  value={form.patientMail}
                  onChange={(e) =>
                    setForm({ ...form, patientMail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Advice/Instructions
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={adviceInstructiosInput}
                  onChange={(e) => setAdviceInstructionInput(e.target.value)}
                  placeholder="Type Advice/Instructions..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    handleAdd(
                      adviceInstructiosInput,
                      setAdviceInstructionInput,
                      adviceInstructions,
                      setAdviceInstructions,
                      "adviceInstruction"
                    )
                  }
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {adviceInstructions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added
                  </span>
                  <button
                    onClick={() =>
                      handleClear(setAdviceInstructions, "adviceInstruction")
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {adviceInstructions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        onClick={() =>
                          handleRemove(
                            index,
                            adviceInstructions,
                            setAdviceInstructions,
                            "adviceInstruction"
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Quick Type
              </label>
              <div className="flex space-x-2">
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Missing Teeth
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Sensitivity
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                  Bleeding gums
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Mail Id
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Teeth Specification
                </label>
                <div className="flex items-center space-x-2 relative">
                  <img
                    src={ToothIcon}
                    alt=""
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  />
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
  <div className="bg-gray-300 min-h-screen flex flex-col">
    {/* Header Section */}
    <div className="bg-gray-300 px-6 py-4">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-normal text-black">Prescriptions</h1>
        <div className="flex items-center text-sm text-blue-600">
          <span className="hover:underline cursor-pointer">Home</span>
          <span className="mx-1">›</span>
          <span>Prescriptions</span>
          <span className="mx-1">›</span>
          <span>Add Prescriptions</span>
        </div>
      </div>
    </div>

    {/* Main Content Card */}
    <div className="px-6 pb-6 flex-1 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg flex flex-col min-h-0">
        {/* Tabs + Content + Button wrapper */}
        <div className="flex flex-col flex-grow">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-grow overflow-auto">{renderTabContent()}</div>

          {/* Save Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleSubmit}
              className="flex-shrink-0 px-6 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default PrescriptionForm;