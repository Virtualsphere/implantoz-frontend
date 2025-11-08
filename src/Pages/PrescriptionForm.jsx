import React, { useRef, useState, useEffect  } from "react";
import { Calendar } from "lucide-react";
import ToothIcon from "../assets/tooth.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from '../config/api';
import Webcam from "react-webcam";

const PrescriptionForm = () => {
  const navigate = useNavigate();
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
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [investigationFiles, setInvestigationFiles] = useState([]);
  const [procedureFiles, setProcedureFiles] = useState([]);
  const [showInvestigationCamera, setShowInvestigationCamera] = useState(false);
  const [showProcedureCamera, setShowProcedureCamera] = useState(false);
  const investigationCamRef = useRef(null);
  const procedureCamRef = useRef(null);
  const [investigationFacingMode, setInvestigationFacingMode] = useState("environment");
  const [procedureFacingMode, setProcedureFacingMode] = useState("environment");


  const [suggestions, setSuggestions] = useState({
    examination: [],
    investigation: [],
    diagnosis: [],
    adviceInstruction: [],
    treatmentPlan: [],
    procedure: []
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("suggestions")) || {
      examination: [],
      investigation: [],
      diagnosis: [],
      adviceInstruction: [],
      treatmentPlan: [],
      procedure: []
    };
    setSuggestions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("suggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (patientQuery.trim().length < 2) {
        setPatientResults([]);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/getPatientName/search?q=${patientQuery}`);
        const data = await res.json();
        setPatientResults(data.suggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    const debounce = setTimeout(fetchPatients, 300);
    return () => clearTimeout(debounce);
  }, [patientQuery]);

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

  const generatePDF = async (prescriptionId) => {
    const response = await fetch(`${API_BASE}/api/generate-prescription-pdf/${prescriptionId}`);

    if (!response.ok) {
      console.error("Failed to fetch PDF");
      return;
    }

    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: "application/pdf" }); // ✅ Explicitly set type
    const url = window.URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  const API_ENDPOINTS = {
    "Chief Complaint": "/api/prescription-complaint",
    Examination: "/api/prescription-examination",
    "Investigation / Finding": "/api/prescription-investigation",
    Diagnosis: "/api/prescription-diagnosis",
    "Treatment Plan": "/api/prescription-treatment-plan",
    Procedure: "/api/prescription-procedure",
    Medication: "/api/prescription/medication",
    "Advice Instructions": "/api/prescription/advice-instruction",
  };

  // ====== Investigation Upload & Camera ======
  const handleInvestigationFileChange = (e) => {
    const files = Array.from(e.target.files);
    setInvestigationFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveInvestigationFile = (index) => {
    setInvestigationFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const captureInvestigationPhoto = async () => {
    const imageSrc = investigationCamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((r) => r.blob());
    const file = new File([blob], `investigation-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    setInvestigationFiles((prev) => [...prev, file]);
    setShowInvestigationCamera(false);
  };

  // ====== Procedure Upload & Camera ======
  const handleProcedureFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProcedureFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveProcedureFile = (index) => {
    setProcedureFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const captureProcedurePhoto = async () => {
    const imageSrc = procedureCamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((r) => r.blob());
    const file = new File([blob], `procedure-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    setProcedureFiles((prev) => [...prev, file]);
    setShowProcedureCamera(false);
  };


  const handleSubmit = async (e) => {
    try {
      const endpoint = API_ENDPOINTS[activeTab];
      if (!endpoint) {
        setMessage("No API endpoint for this tab");
        return;
      }

      const method= prescriptionId ? "PUT" : "POST";

      // 👉 Use FormData instead of JSON for all tabs (handles both text + files)
      const formData = new FormData();

      // Common fields
      formData.append("doctorName", form.doctorName);
      formData.append("patientMail", form.patientMail);
      formData.append("patientName", form.patientName);
      formData.append("teethSpecification", form.teethSpecification || "");
      if (prescriptionId) formData.append("prescriptionId", prescriptionId);

      // Handle specific tab
      switch (activeTab) {
        case "Chief Complaint":
          formData.append("chiefComplaint", form.chiefComplaint);
          break;

        case "Examination":
          formData.append("examination", JSON.stringify(form.examination));
          break;

        case "Investigation / Finding":
          formData.append("investigation", JSON.stringify(form.investigation));
          if (investigationFiles.length > 0) {
            investigationFiles.forEach((file) => formData.append("files", file));
          }
          break;

        case "Diagnosis":
          formData.append("diagnosis", JSON.stringify(form.diagnosis));
          break;

        case "Treatment Plan":
          formData.append("treatmentPlan", JSON.stringify(form.treatmentPlan));
          break;

        case "Procedure":
          formData.append("procedure", JSON.stringify(form.procedure));
          if (procedureFiles.length > 0) {
            procedureFiles.forEach((file) => formData.append("files", file));
          }
          break;

        case "Medication":
          formData.append("medication", JSON.stringify(form.medication));
          break;

        case "Advice Instructions":
          formData.append("adviceInstruction", JSON.stringify(form.adviceInstruction));
          break;

        default:
          break;
      }

      // 🔥 Fetch without JSON headers (FormData auto-handles it)
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Store prescriptionId if first tab
        if (activeTab === "Chief Complaint" && data.prescriptionId) {
          setPrescriptionId(data.prescriptionId);
        }

        toast.success(data.message || "Saved successfully");

        // ✅ Reset file states after successful upload
        setInvestigationFiles([]);
        setProcedureFiles([]);

        // ✅ Clear inputs (same as your existing logic)
        switch (activeTab) {
          case "Chief Complaint":
            setForm((prev) => ({ ...prev, chiefComplaint: "" }));
            break;
          case "Examination":
            setForm((prev) => ({ ...prev, examination: [] }));
            setExaminations([]);
            break;
          case "Investigation / Finding":
            setForm((prev) => ({ ...prev, investigation: [] }));
            setInvestigations([]);
            break;
          case "Diagnosis":
            setForm((prev) => ({ ...prev, diagnosis: [] }));
            setDiagnoses([]);
            break;
          case "Treatment Plan":
            setForm((prev) => ({ ...prev, treatmentPlan: [] }));
            setTreatmentPlans([]);
            break;
          case "Procedure":
            setForm((prev) => ({ ...prev, procedure: [] }));
            setProcedures([]);
            break;
          case "Medication":
            setForm((prev) => ({ ...prev, medication: [] }));
            break;
          case "Advice Instructions":
            setForm((prev) => ({ ...prev, adviceInstruction: [] }));
            setAdviceInstructions([]);
            break;
        }

        // ✅ Move automatically to the next tab
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        }
      } else {
        setMessage(data.message || "Failed to save data");
        toast.error(data.message || "Failed to save data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
      const newItem = input.trim();
      const newItems = [...items, newItem];
      setItems(newItems);

      // Update main form data if needed
      setForm((prev) => ({ ...prev, [key]: newItems }));
      setInput("");

      // ✅ Add new quick suggestion if not already in list
      setSuggestions((prev) => ({
        ...prev,
        [key]: prev[key].includes(newItem)
          ? prev[key]
          : [...prev[key], newItem],
      }));
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

  const handleLoadForUpdate = async () => {
    if (!prescriptionId) {
      toast.error("No prescription found to update");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/prescription-update-data/${prescriptionId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch prescription data");

      // 🧩 Populate form states based on your backend structure
      setForm({
        ...form,
        chiefComplaint: data.complaint?.complaint || "",
        examination: data.examination?.examination || [],
        investigation: data.investigation?.investigation_type
          ? [data.investigation.investigation_type]
          : [],
        diagnosis: data.diagnosis?.diagnosis ? [data.diagnosis.diagnosis] : [],
        treatmentPlan: data.treatmentPlan
          ? [
              {
                teethSpecification: data.treatmentPlan.teeth_number,
                procedure: data.treatmentPlan.procedure_details || "",
                date: data.treatmentPlan.treatment_plan_date || "",
                amount: data.treatmentPlan.amount || "",
              },
            ]
          : [],
        procedure: data.procedure?.procedures ? [data.procedure.procedures] : [],
        adviceInstruction: data.adviceInstruction?.instructions || [],
        medication: data.medication
          ? [
              {
                drugName: data.medication.medicine_name || "",
                frequency: data.medication.frequency || "",
                duration: data.medication.duration || "",
                instruction: data.medication.instruction || "",
              },
            ]
          : [],
      });

      // 🧠 Sync tab-level arrays
      setExaminations(data.examination?.examination || []);
      setInvestigations(
        data.investigation?.investigation_type
          ? [data.investigation.investigation_type]
          : []
      );
      setDiagnoses(data.diagnosis?.diagnosis ? [data.diagnosis.diagnosis] : []);
      setTreatmentPlans(
        data.treatmentPlan
          ? [
              {
                teethSpecification: data.treatmentPlan.teeth_number,
                procedure: data.treatmentPlan.procedure_details || "",
                date: data.treatmentPlan.treatment_plan_date || "",
                amount: data.treatmentPlan.amount || "",
              },
            ]
          : []
      );
      setProcedures(data.procedure?.procedures ? [data.procedure.procedures] : []);
      setAdviceInstructions(data.adviceInstruction?.instructions || []);

      toast.success("Prescription data loaded for editing!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load prescription data");
    }
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
                <div className="relative">
                  <input
                    type="text"
                    value={patientQuery || form.patientName}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      setForm({ ...form, patientName: e.target.value });
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter patient name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  {/* Dropdown suggestions */}
                  {showSuggestions && patientResults.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-y-auto">
                      {patientResults.map((p) => (
                        <div
                          key={p.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              patientName: p.name,
                              patientMail: p.email,
                            }));
                            setPatientQuery(p.name);
                            setShowSuggestions(false);
                          }}
                        >
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-gray-500">{p.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
              <div className="flex flex-wrap gap-2">
                {suggestions.examination.length > 0 ? (
                  suggestions.examination.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAdd(item, setExaminationInput, examinations, setExaminations, "examination")
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggestions yet</span>
                )}
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
            </div>

            {/* File upload for Investigation */}
            <div className="space-y-4 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Investigation Files or Capture Photo
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleInvestigationFileChange}
                  className="border p-2 rounded text-sm w-full sm:w-auto"
                />
                <button
                  onClick={() => setShowInvestigationCamera(!showInvestigationCamera)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {showInvestigationCamera ? "Close Camera" : "Take Photo"}
                </button>
              </div>

              {showInvestigationCamera && (
                <div className="border rounded p-3 bg-gray-50 flex flex-col items-center">
                  <Webcam
                    ref={investigationCamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: investigationFacingMode }}
                    className="rounded mb-3"
                  />

                  <button
                    onClick={() =>
                      setInvestigationFacingMode((prev) =>
                        prev === "user" ? "environment" : "user"
                      )
                    }
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm mb-3"
                  >
                    Switch Camera
                  </button>
                  <button
                    onClick={captureInvestigationPhoto}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Capture Photo
                  </button>
                </div>
              )}

              {investigationFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {investigationFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-gray-100 rounded p-2 text-sm"
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleRemoveInvestigationFile(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="flex flex-wrap gap-2">
                {suggestions.investigation.length > 0 ? (
                  suggestions.investigation.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAdd(item, setInvestigationInput, investigations, setInvestigations, "investigation")
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggestions yet</span>
                )}
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
              <div className="flex flex-wrap gap-2">
                {suggestions.diagnosis.length > 0 ? (
                  suggestions.diagnosis.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAdd(item, setDiagnosisInput, diagnoses, setDiagnoses, "diagnosis")
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggestions yet</span>
                )}
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
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Quick Type
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestions.treatmentPlan.length > 0 ? (
                  suggestions.treatmentPlan.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAdd(item, setTreatmentPlanInput, treatmentPlans, setTreatmentPlans, "treatmentPlan")
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggestions yet</span>
                )}
              </div>
            </div>
          </div>
        );

      case "Procedure":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Add Procedure
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={procedureInput}
                    onChange={(e) => setProcedureInput(e.target.value)}
                    placeholder="Add Procedure..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() =>
                      handleAdd(
                        procedureInput,
                        setProcedureInput,
                        procedures,
                        setProcedures,
                        "procedure"
                      )
                    }
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* File upload for Procedure */}
            <div className="space-y-4 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Procedure Files or Capture Photo
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleProcedureFileChange}
                  className="border p-2 rounded text-sm w-full sm:w-auto"
                />
                <button
                  onClick={() => setShowProcedureCamera(!showProcedureCamera)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {showProcedureCamera ? "Close Camera" : "Take Photo"}
                </button>
              </div>

              {showProcedureCamera && (
                <div className="border rounded p-3 bg-gray-50 flex flex-col items-center">
                  <Webcam
                    ref={procedureCamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: procedureFacingMode }}
                    className="rounded mb-3"
                  />

                  <button
                    onClick={() =>
                      setProcedureFacingMode((prev) =>
                        prev === "user" ? "environment" : "user"
                      )
                    }
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm mb-3"
                  >
                    Switch Camera
                  </button>
                  <button
                    onClick={captureProcedurePhoto}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Capture Photo
                  </button>
                </div>
              )}

              {procedureFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {procedureFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-gray-100 rounded p-2 text-sm"
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleRemoveProcedureFile(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {procedures.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added
                  </span>
                  <button
                    onClick={() => handleClear(setProcedures, "procedure")}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {procedures.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        onClick={() =>
                          handleRemove(
                            index,
                            procedures,
                            setProcedures,
                            "procedure"
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
              <div className="flex flex-wrap gap-2">
                {suggestions.diagnosis.length > 0 ? (
                  suggestions.diagnosis.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAdd(item, setDiagnosisInput, diagnoses, setDiagnoses, "diagnosis")
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggestions yet</span>
                )}
              </div>
            </div>
          </div>
        );

      case "Medication":
        return (
          <div className="space-y-6">
            {/* Medication Table */}
            <div className="space-y-4">
              <div className="overflow-x-auto border border-gray-200 rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Medicine
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
                              <option value="0-0-1">1-0-1</option>
                              <option value="0-0-1">0-0-1</option>
                              <option value="0-0-1">0-1-1</option>
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

                          {/* Instruction with dropdown and custom option */}
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                              <select
                                value={
                                  ["Before Food", "After Food", "Other"].includes(med.instruction)
                                    ? med.instruction
                                    : "Other"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updated = [...form.medication];

                                  if (value === "Other") {
                                    // Keep current custom value if already typed
                                    updated[index].instruction =
                                      ["Before Food", "After Food"].includes(updated[index].instruction)
                                        ? ""
                                        : updated[index].instruction;
                                  } else {
                                    updated[index].instruction = value;
                                  }

                                  setForm({ ...form, medication: updated });
                                }}
                                className="w-full border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="Before Food">Before Food</option>
                                <option value="After Food">After Food</option>
                                <option value="Other">Other</option>
                              </select>

                              {/* If 'Other' is selected → show text input */}
                              {(!["Before Food", "After Food"].includes(med.instruction)) && (
                                <input
                                  type="text"
                                  value={med.instruction}
                                  onChange={(e) => {
                                    const updated = [...form.medication];
                                    updated[index].instruction = e.target.value;
                                    setForm({ ...form, medication: updated });
                                  }}
                                  placeholder="Custom instruction..."
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              )}
                            </div>
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
              <div className="flex flex-wrap gap-2">
                {suggestions.adviceInstruction.length > 0 ? (
                  suggestions.adviceInstruction.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAdd(item, setAdviceInstructionInput, adviceInstructions, setAdviceInstructions, "adviceInstruction")
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No suggestions yet</span>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
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
          <span onClick={() => navigate("/prescription")} className="hover:underline cursor-pointer">Home</span>
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
            {activeTab === "Advice Instructions" && (
              <>
                <button
                  onClick={() => generatePDF(prescriptionId)}
                  className="ml-3 px-6 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded"
                  disabled={!prescriptionId}
                >
                  Generate PDF
                </button>

                <button
                  onClick={handleLoadForUpdate}
                  className="ml-3 px-6 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  disabled={!prescriptionId}
                  >
                  Load for Update
                </button>
              </>
            )}
            {message && <p>{message}</p>}
          </div>
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

export default PrescriptionForm;
