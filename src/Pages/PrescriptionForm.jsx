import React, { useRef, useState, useEffect } from "react";
import ToothIcon from "../assets/tooth.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import Webcam from "react-webcam";

// Quick Type Section Component
const QuickTypeSection = React.memo(({ 
  tab, 
  quickTypeInputs, 
  setQuickTypeInputs,
  quickTypes,
  loadingQuickTypes,
  handleAddQuickType,
  handleDeleteQuickType,
  handleUseQuickType 
}) => (
  <div className="mt-6 border-t pt-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Quick Types
    </label>
    
    {/* Add Quick Type Input */}
    <div className="flex gap-2 mb-3">
      <input
        type="text"
        key={`quick-input-${tab}`} // Add a stable key
        value={quickTypeInputs[tab] || ""}
        onChange={(e) => setQuickTypeInputs(prev => ({
          ...prev,
          [tab]: e.target.value
        }))}
        placeholder={`Add quick type for ${tab}`}
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={() => handleAddQuickType(tab)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
      >
        Add Quick Type
      </button>
    </div>
    
    {/* Display Quick Types */}
    <div className="mt-4">
      <label className="block text-sm text-gray-700 mb-2">
        Quick Type Suggestions
      </label>
      {loadingQuickTypes ? (
        <p className="text-sm text-gray-500">Loading quick types...</p>
      ) : quickTypes[tab]?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {quickTypes[tab].map((item) => (
            <div key={item.id} className="flex items-center gap-1">
              <button
                onClick={() => handleUseQuickType(tab, item.quick_type)}
                className="border border-gray-300 px-3 py-1 rounded text-sm bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {item.quick_type}
              </button>
              <button
                onClick={() => handleDeleteQuickType(tab, item.id)}
                className="text-red-500 hover:text-red-700 text-xs"
                title="Delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No quick types yet. Add some above.</p>
      )}
    </div>
  </div>
));

const PrescriptionForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Chief Complaint");
  const [examinationInput, setExaminationInput] = useState("");
  const [examinationTeeth, setExaminationTeeth] = useState("");
  const [investigationInput, setInvestigationInput] = useState("");
  const [investigationTeeth, setInvestigationTeeth] = useState("");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [diagnosisTeeth, setDiagnosisTeeth] = useState("");
  const [treatmentPlanInput, setTreatmentPlanInput] = useState("");
  const [procedureInput, setProcedureInput] = useState("");
  const [procedureTeeth, setProcedureTeeth] = useState("");
  const [adviceInstructiosInput, setAdviceInstructionInput] = useState("");
  const [treatmentDate, setTreatmentDate] = useState("");
  const [treatmentAmount, setTreatmentAmount] = useState("");
  const [treatmentTeeth, setTreatmentTeeth] = useState("");

  const [examinations, setExaminations] = useState([]);
  const [chiefComplaintInput, setChiefComplaintInput] = useState("");
  const [chiefComplaints, setChiefComplaints] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [adviceInstructions, setAdviceInstructions] = useState([]);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [doctorQuery, setDoctorQuery] = useState("");
  const [doctorResults, setDoctorResults] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);

  // Quick type states
  const [quickTypeInputs, setQuickTypeInputs] = useState({
    "Chief Complaint": "",
    "Examination": "",
    "Investigation / Finding": "",
    "Diagnosis": "",
    "Treatment Plan": "",
    "Procedure": "",
    "Advice Instructions": ""
  });
  
  const [quickTypes, setQuickTypes] = useState({
    "Chief Complaint": [],
    "Examination": [],
    "Investigation / Finding": [],
    "Diagnosis": [],
    "Treatment Plan": [],
    "Procedure": [],
    "Advice Instructions": []
  });
  
  const [loadingQuickTypes, setLoadingQuickTypes] = useState(false);

  // store files as objects: { name, file: File, preview: string (blob:... or data:image/...) }
  const [investigationFiles, setInvestigationFiles] = useState([]);
  const [procedureFiles, setProcedureFiles] = useState([]);
  const [examinationFiles, setExaminationFiles]= useState([]);

  const [showInvestigationCamera, setShowInvestigationCamera] = useState(false);
  const [showProcedureCamera, setShowProcedureCamera] = useState(false);
  const [showExaminationCamera, setShowExaminationCamera]= useState(false);
  const investigationCamRef = useRef(null);
  const procedureCamRef = useRef(null);
  const examinationCamRef= useRef(null);
  const [investigationFacingMode, setInvestigationFacingMode] =
    useState("environment");
  const [procedureFacingMode, setProcedureFacingMode] = useState("environment");
  const [examinationFacingMode, setExaminationFacingMode]= useState("environment");

  const [clinics, setClinics] = useState([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);

  // Fetch quick types when tab changes
  useEffect(() => {
    fetchQuickTypesForTab(activeTab);
  }, [activeTab]);

  // Function to fetch quick types for a specific tab
  const fetchQuickTypesForTab = async (tab) => {
    setLoadingQuickTypes(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/quick-type?tab=${encodeURIComponent(tab)}`
      );
      const data = await res.json();
      
      if (res.ok && data.success) {
        setQuickTypes(prev => ({
          ...prev,
          [tab]: data.data || []
        }));
      }
    } catch (err) {
      console.error(`Error fetching quick types for ${tab}:`, err);
      toast.error(`Failed to load quick types for ${tab}`);
    } finally {
      setLoadingQuickTypes(false);
    }
  };

  // Function to add quick type
  const handleAddQuickType = async (tab) => {
    const inputValue = quickTypeInputs[tab]?.trim();
    if (!inputValue) {
      toast.error("Please enter a quick type value");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/quick-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quickTypes: [{
            tab: tab,
            value: inputValue
          }]
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Quick type added successfully");
        // Clear input
        setQuickTypeInputs(prev => ({
          ...prev,
          [tab]: ""
        }));
        // Refresh quick types for this tab
        fetchQuickTypesForTab(tab);
      } else {
        toast.error(data.message || "Failed to add quick type");
      }
    } catch (err) {
      console.error("Error adding quick type:", err);
      toast.error("Failed to add quick type");
    }
  };

  // Function to delete quick type
  const handleDeleteQuickType = async (tab, id) => {
    try {
      const res = await fetch(`${API_BASE}/api/quick-type/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Quick type deleted successfully");
        // Remove from local state
        setQuickTypes(prev => ({
          ...prev,
          [tab]: prev[tab].filter(item => item.id !== id)
        }));
      } else {
        toast.error(data.message || "Failed to delete quick type");
      }
    } catch (err) {
      console.error("Error deleting quick type:", err);
      toast.error("Failed to delete quick type");
    }
  };

  // Function to use quick type
  const handleUseQuickType = (tab, value) => {
    setQuickTypeInputs(prev => ({
      ...prev,
      [tab]: value
    }));
    switch (tab) {
      case "Chief Complaint":
        setChiefComplaintInput(value);
        break;
      case "Examination":
        setExaminationInput(value);
        break;
      case "Investigation / Finding":
        setInvestigationInput(value);
        break;
      case "Diagnosis":
        setDiagnosisInput(value);
        break;
      case "Treatment Plan":
        setTreatmentPlanInput(value);
        break;
      case "Procedure":
        setProcedureInput(value);
        break;
      case "Advice Instructions":
        setAdviceInstructionInput(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      if (patientQuery.trim().length < 2) {
        setPatientResults([]);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/api/getPatientName/search?q=${patientQuery}`
        );
        const data = await res.json();
        setPatientResults(data.suggestions || []);
        setShowPatientSuggestions(true);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    const debounce = setTimeout(fetchPatients, 300);
    return () => clearTimeout(debounce);
  }, [patientQuery]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (doctorQuery.trim().length < 2) {
        setDoctorResults([]);
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE}/auth/get-name/search?q=${doctorQuery}`
        );
        const data = await res.json();
        setDoctorResults(data.suggestions || []);
        setShowDoctorSuggestions(true);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    const debounce = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(debounce);
  }, [doctorQuery]);

  const [form, setForm] = useState({
    doctorId: "",
    patientId: "",
    patientName: "",
    teethSpecification: "",
    clinicCode: "",
    chiefComplaint: [],
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
    const response = await fetch(
      `${API_BASE}/api/generate-prescription-pdf/${prescriptionId}`
    );

    if (!response.ok) {
      console.error("Failed to fetch PDF");
      return;
    }

    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);
    window.open(url);
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
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

  const dataURLtoFile = (dataurl, filename) => {
    if (!dataurl) return null;
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleExaminationFileChange= (e) =>{
    const files= Array.from(e.target.files || []);
    const mapped= files.map((file)=>({
      name: file.name,
      file,
      preview: URL.createObjectURL(file),
    }));
    setExaminationFiles((prev) => [...prev, ...mapped]);
  }

  const handleRemoveExaminationFile = (index) => {
    setExaminationFiles((prev) => {
      const toRemove = prev[index];
      if (toRemove?.preview?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(toRemove.preview);
        } catch (e) {}
      }
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  };

  const captureExaminationPhoto = async () => {
    if (!examinationCamRef.current) return;
    const imageSrc = examinationCamRef.current.getScreenshot(); // dataURL
    try {
      // create File from dataURL
      const file = dataURLtoFile(imageSrc, `examination-${Date.now()}.jpg`);
      const preview = imageSrc;
      setExaminationFiles((prev) => [
        ...prev,
        { name: file.name, file, preview },
      ]);
      setShowExaminationCamera(false);
    } catch (err) {
      console.error("Failed to capture examination photo", err);
      toast.error("Capture failed");
    }
  };

  // ====== Investigation Upload & Camera ======
  const handleInvestigationFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      name: file.name,
      file,
      preview: URL.createObjectURL(file),
    }));
    // append (do not replace)
    setInvestigationFiles((prev) => [...prev, ...mapped]);
  };

  const handleRemoveInvestigationFile = (index) => {
    setInvestigationFiles((prev) => {
      const toRemove = prev[index];
      if (toRemove?.preview?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(toRemove.preview);
        } catch (e) {}
      }
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  };

  const captureInvestigationPhoto = async () => {
    if (!investigationCamRef.current) return;
    const imageSrc = investigationCamRef.current.getScreenshot(); // dataURL
    try {
      // create File from dataURL
      const file = dataURLtoFile(imageSrc, `investigation-${Date.now()}.jpg`);
      const preview = imageSrc; // show base64 immediately
      setInvestigationFiles((prev) => [
        ...prev,
        { name: file.name, file, preview },
      ]);
      setShowInvestigationCamera(false);
    } catch (err) {
      console.error("Failed to capture investigation photo", err);
      toast.error("Capture failed");
    }
  };

  // ====== Procedure Upload & Camera ======
  const handleProcedureFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      name: file.name,
      file,
      preview: URL.createObjectURL(file),
    }));
    setProcedureFiles((prev) => [...prev, ...mapped]);
  };

  const handleRemoveProcedureFile = (index) => {
    setProcedureFiles((prev) => {
      const toRemove = prev[index];
      if (toRemove?.preview?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(toRemove.preview);
        } catch (e) {}
      }
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  };

  const captureProcedurePhoto = async () => {
    if (!procedureCamRef.current) return;
    const imageSrc = procedureCamRef.current.getScreenshot(); // dataURL
    try {
      const file = dataURLtoFile(imageSrc, `procedure-${Date.now()}.jpg`);
      const preview = imageSrc;
      setProcedureFiles((prev) => [
        ...prev,
        { name: file.name, file, preview },
      ]);
      setShowProcedureCamera(false);
    } catch (err) {
      console.error("Failed to capture procedure photo", err);
      toast.error("Capture failed");
    }
  };

  useEffect(() => {
    const fetchClinics = async () => {
      setIsLoadingClinics(true);
      try {
        const res = await fetch(`${API_BASE}/api/clinic/code`);
        const data = await res.json();

        if (data.success && data.data?.result) {
          setClinics(data.data.result);
        } else {
          toast.error("Failed to fetch clinic data");
        }
      } catch (err) {
        console.error("Error fetching clinics:", err);
        toast.error("Error loading clinic data");
      } finally {
        setIsLoadingClinics(false);
      }
    };

    fetchClinics();
  }, []);

  // When you submit, convert current files to FormData properly
  const handleSubmit = async (e) => {
    try {
      const endpoint = API_ENDPOINTS[activeTab];
      if (!endpoint) {
        setMessage("No API endpoint for this tab");
        return;
      }

      const method = prescriptionId ? "PUT" : "POST";
      const hasFiles =
        activeTab === "Investigation / Finding" || activeTab === "Procedure" || activeTab== "Examination";

      let body;
      let headers = {};

      if (hasFiles) {
        body = new FormData();
        body.append("doctorId", form.doctorId);
        body.append("patientId", form.patientId);
        body.append("patientName", form.patientName);
        body.append("teethSpecification", form.teethSpecification || "");
        body.append("clinicCode", form.clinicCode || "");
        if (prescriptionId) body.append("prescriptionId", prescriptionId);

        if (activeTab === "Investigation / Finding") {
          body.append(
            "investigation",
            JSON.stringify(form.investigation || [])
          );
          // append files
          investigationFiles.forEach((f) => {
            // f.file should be a File (for captures we created File). But just in case:
            const fileToAppend =
              f.file instanceof File
                ? f.file
                : dataURLtoFile(
                    f.preview,
                    f.name || `investigation-${Date.now()}.jpg`
                  );
            if (fileToAppend) body.append("files", fileToAppend);
          });
        }
        else if (activeTab === "Examination") {
          body.append("examination", JSON.stringify(form.examination || []));
          examinationFiles.forEach((f) => {
            const fileToAppend =
              f.file instanceof File
                ? f.file
                : dataURLtoFile(
                    f.preview,
                    f.name || `examination-${Date.now()}.jpg`
                  );
            if (fileToAppend) body.append("files", fileToAppend);
          });
        }
        else if (activeTab === "Procedure") {
          body.append("procedure", JSON.stringify(form.procedure || []));
          procedureFiles.forEach((f) => {
            const fileToAppend =
              f.file instanceof File
                ? f.file
                : dataURLtoFile(
                    f.preview,
                    f.name || `procedure-${Date.now()}.jpg`
                  );
            if (fileToAppend) body.append("files", fileToAppend);
          });
        }
      } else {
        const payload = {
          doctorId: form.doctorId,
          patientId: form.patientId,
          patientName: form.patientName,
        };

        if (prescriptionId) payload.prescriptionId = prescriptionId;

        switch (activeTab) {
          case "Chief Complaint":
            payload.complaints = form.chiefComplaint;
            break;
          case "Diagnosis":
            payload.diagnosis = form.diagnosis;
            break;
          case "Treatment Plan":
            payload.treatmentPlan = form.treatmentPlan;
            break;
          case "Medication":
            payload.medication = form.medication;
            break;
          case "Advice Instructions":
            payload.adviceInstruction = form.adviceInstruction;
            break;
          default:
            break;
        }

        body = JSON.stringify(payload);
        headers["Content-Type"] = "application/json";
      }

      // Send request
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body,
      });

      const data = await res.json();

      if (res.ok) {
        if (activeTab === "Chief Complaint" && data.prescriptionId) {
          setPrescriptionId(data.prescriptionId);
        }

        toast.success(data.message || "Saved successfully");

        // Reset file states (but keep previews cleaned)
        setInvestigationFiles([]);
        setProcedureFiles([]);
        setExaminationFiles([]);

        // Clear inputs by tab
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
          default:
            break;
        }

        // Move to next tab automatically
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

    setTreatmentPlanInput("");
    setTreatmentTeeth("");
    setTreatmentDate("");
    setTreatmentAmount("");
  };

  // EXAMINATION
  const handleAddExamination = () => {
    if (!examinationInput.trim() && !examinationTeeth.trim()) return;

    const newItem = {
      examination: examinationInput.trim(),
      teethSpecification: examinationTeeth.trim(),
    };

    const newItems = [...examinations, newItem];
    setExaminations(newItems);
    setForm((prev) => ({ ...prev, examination: newItems }));

    setExaminationInput("");
    setExaminationTeeth("");
  };

  // INVESTIGATION
  const handleAddInvestigation = () => {
    if (!investigationInput.trim() && !investigationTeeth.trim()) return;

    const newItem = {
      investigation: investigationInput.trim(),
      teethSpecification: investigationTeeth.trim(),
    };

    const newItems = [...investigations, newItem];
    setInvestigations(newItems);
    setForm((prev) => ({ ...prev, investigation: newItems }));

    setInvestigationInput("");
    setInvestigationTeeth("");
  };

  // DIAGNOSIS
  const handleAddDiagnosis = () => {
    if (!diagnosisInput.trim() && !diagnosisTeeth.trim()) return;

    const newItem = {
      diagnosis: diagnosisInput.trim(),
      teethSpecification: diagnosisTeeth.trim(),
    };

    const newItems = [...diagnoses, newItem];
    setDiagnoses(newItems);
    setForm((prev) => ({ ...prev, diagnosis: newItems }));

    setDiagnosisInput("");
    setDiagnosisTeeth("");
  };

  // PROCEDURE
  const handleAddProcedure = () => {
    if (!procedureInput.trim() && !procedureTeeth.trim()) return;

    const newItem = {
      procedure: procedureInput.trim(),
      teethSpecification: procedureTeeth.trim(),
    };

    const newItems = [...procedures, newItem];
    setProcedures(newItems);
    setForm((prev) => ({ ...prev, procedure: newItems }));

    setProcedureInput("");
    setProcedureTeeth("");
  };

  const handleAddChiefComplaint = () => {
    const trimmedInput = chiefComplaintInput.trim();
    if (!trimmedInput) return;

    const newItems = [...chiefComplaints, trimmedInput];
    setChiefComplaints(newItems);
    setForm((prev) => ({ ...prev, chiefComplaint: newItems }));
    setChiefComplaintInput("");
  };

  const handleRemoveChiefComplaint = (index) => {
    const newItems = chiefComplaints.filter((_, i) => i !== index);
    setChiefComplaints(newItems);
    setForm((prev) => ({ ...prev, chiefComplaint: newItems }));
  };

  const handleAdd = (input, setInput, items, setItems, key) => {
    if (input.trim()) {
      const newItem = input.trim();
      const newItems = [...items, newItem];
      setItems(newItems);
      setForm((prev) => ({ ...prev, [key]: newItems }));
      setInput("");
    }
  };

  const handleRemove = (index, items, setItems, key) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setForm((prev) => ({ ...prev, [key]: newItems }));
  };

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
      const res = await fetch(
        `${API_BASE}/api/prescription-update-data/${prescriptionId}`
      );
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to fetch prescription data");

      // --- MAP ALL DATA ARRAYS PROPERLY ---

      const fetchedChiefComplaints = Array.isArray(data.complaint)
        ? data.complaint.map((c) => c.complaint?.[0] || "")
        : [];

      const fetchedExaminations = Array.isArray(data.examination)
        ? data.examination.map((item) => ({
            examination: item.examination?.[0] || "",
            teethSpecification: item.teeth_number || "",
          }))
        : [];

      const fetchedInvestigations = Array.isArray(data.investigation)
        ? data.investigation.map((item) => ({
            investigation: item.investigation_type?.[0] || "",
            teethSpecification: item.teeth_number || "",
          }))
        : [];

      const fetchedDiagnoses = Array.isArray(data.diagnosis)
        ? data.diagnosis.map((item) => ({
            diagnosis: item.diagnosis?.[0] || "",
            teethSpecification: item.teeth_number || "",
          }))
        : [];

      const fetchedTreatmentPlans = Array.isArray(data.treatmentPlan)
        ? data.treatmentPlan.map((item) => ({
            teethSpecification: item.teeth_number || "",
            procedure: item.procedure?.[0] || "",
            date: item.date || "",
            amount: item.amount || "",
          }))
        : [];

      const fetchedProcedures = Array.isArray(data.procedure)
        ? data.procedure.map((item) => ({
            procedure: item.procedures?.[0] || "",
            teethSpecification: item.teeth_number || "",
          }))
        : [];

      const fetchedAdvice = Array.isArray(data.adviceInstruction)
        ? data.adviceInstruction.map((a) => a.instructions?.[0] || "")
        : [];

      const fetchedMedications = Array.isArray(data.medication)
        ? data.medication.map((m) => ({
            drugName: m.drugName || "",
            frequency: m.frequency || "",
            duration: m.duration || "",
            instruction: m.instruction || "",
          }))
        : [];


      setForm((prev) => ({
        ...prev,
        chiefComplaint: fetchedChiefComplaints,
        examination: fetchedExaminations,
        investigation: fetchedInvestigations,
        diagnosis: fetchedDiagnoses,
        treatmentPlan: fetchedTreatmentPlans,
        procedure: fetchedProcedures,
        adviceInstruction: fetchedAdvice,
        medication: fetchedMedications,
        clinicCode: data.clinicCode || "",
      }));

      // --- UPDATE INDIVIDUAL UI STATES ---

      setChiefComplaints(fetchedChiefComplaints);
      setExaminations(fetchedExaminations);
      setInvestigations(fetchedInvestigations);
      setDiagnoses(fetchedDiagnoses);
      setTreatmentPlans(fetchedTreatmentPlans);
      setProcedures(fetchedProcedures);
      setAdviceInstructions(fetchedAdvice);

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
              {/* Patient Name */}
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
                    onFocus={() => setShowPatientSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowPatientSuggestions(false), 200)
                    }
                    placeholder="Enter patient name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {showPatientSuggestions && patientResults.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-y-auto">
                      {patientResults.map((p) => (
                        <div
                          key={p.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => {
                            setForm((prev) => ({
                              ...prev,
                              patientName: p.name,
                              patientId: p.patient_id,
                            }));
                            setPatientQuery(p.name);
                            setShowPatientSuggestions(false);
                          }}
                        >
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-gray-500">{p.email}</p>
                          <p className="text-sm text-gray-500">{p.mobile}</p>
                          <p className="text-sm text-gray-500">
                            {p.patient_id}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient ID */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Patient Id
                </label>
                <input
                  type="text"
                  value={form.patientId}
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Doctor Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={doctorQuery || form.doctorId}
                    onChange={(e) => {
                      setDoctorQuery(e.target.value);
                      setForm({ ...form, doctorId: e.target.value });
                    }}
                    onFocus={() => setShowDoctorSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowDoctorSuggestions(false), 200)
                    }
                    placeholder="Enter doctor name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {showDoctorSuggestions && doctorResults.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-y-auto">
                      {doctorResults.map((p) => (
                        <div
                          key={p.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => {
                            setForm((prev) => ({
                              ...prev,
                              doctorId: p.doctor_id,
                            }));
                            setDoctorQuery(p.name);
                            setShowDoctorSuggestions(false);
                          }}
                        >
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-gray-500">{p.email}</p>
                          <p className="text-sm text-gray-500">{p.mobile}</p>
                          <p className="text-sm text-gray-500">{p.doctor_id}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Clinic Code Selector - NEW */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Select Clinic
                </label>
                <select
                  value={form.clinicCode}
                  onChange={(e) => {
                    const selectedClinicCode = e.target.value;
                    setForm({ ...form, clinicCode: selectedClinicCode });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoadingClinics}
                >
                  <option value="">Select a clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.clinic_code}>
                      {clinic.clinic_name} - {clinic.clinic_code}
                    </option>
                  ))}
                </select>
                {isLoadingClinics && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading clinics...
                  </p>
                )}
                {form.clinicCode && (
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <p>
                      Selected Clinic Code: <strong>{form.clinicCode}</strong>
                    </p>
                    {clinics.find((c) => c.clinic_code === form.clinicCode)
                      ?.address && (
                      <p className="mt-1">
                        Address:{" "}
                        {
                          clinics.find((c) => c.clinic_code === form.clinicCode)
                            .address
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Chief Complaints Input + List */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Add Chief Complaint
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={chiefComplaintInput}
                  onChange={(e) => setChiefComplaintInput(e.target.value)}
                  placeholder="Enter chief complaint"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddChiefComplaint}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 rounded"
                >
                  Add
                </button>
              </div>

              {chiefComplaints.length > 0 && (
                <ul className="border border-gray-200 rounded p-2 space-y-1 bg-gray-50">
                  {chiefComplaints.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChiefComplaint(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Chief Complaint"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
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
                    type="number"
                    value={examinationTeeth}
                    onChange={(e) => setExaminationTeeth(e.target.value)}
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Examination
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={examinationInput}
                    onChange={(e) => setExaminationInput(e.target.value)}
                    placeholder="Add examination..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddExamination}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

             {/* File upload for Examination */}
            <div className="space-y-4 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Examination Files or Capture Photo
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleExaminationFileChange}
                  className="border p-2 rounded text-sm w-full sm:w-auto"
                />
                <button
                  onClick={() =>
                    setShowExaminationCamera(!showExaminationCamera)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {showExaminationCamera ? "Close Camera" : "Take Photo"}
                </button>
              </div>

              {showExaminationCamera && (
                <div className="border rounded p-3 bg-gray-50 flex flex-col items-center">
                  <Webcam
                    ref={examinationCamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: examinationFacingMode }}
                    className="rounded mb-3"
                  />

                  <button
                    onClick={() =>
                      setExaminationFacingMode((prev) =>
                        prev === "user" ? "environment" : "user"
                      )
                    }
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm mb-3"
                  >
                    Switch Camera
                  </button>
                  <button
                    onClick={captureExaminationPhoto}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Capture Photo
                  </button>
                </div>
              )}

              {/* Previews */}
              {examinationFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {examinationFiles.map((file, i) => (
                      <div
                        key={i}
                        className="relative border rounded overflow-hidden bg-gray-50"
                      >
                        {file.preview &&
                        (file.preview.startsWith("data:image") ||
                          file.preview.includes("blob:")) ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="object-cover w-full h-32"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32 text-xs text-gray-500">
                            <span>{file.name}</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveExaminationFile(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {examinations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added Examinations
                  </span>
                  <button
                    onClick={() => {
                      setExaminations([]);
                      setForm((prev) => ({ ...prev, examination: [] }));
                    }}
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
                      <div className="text-sm">
                        <strong>Examination:</strong> {item.examination} <br />
                        <strong>Teeth:</strong> {item.teethSpecification}
                      </div>
                      <button
                        onClick={() => {
                          const newItems = examinations.filter(
                            (_, i) => i !== index
                          );
                          setExaminations(newItems);
                          setForm((prev) => ({
                            ...prev,
                            examination: newItems,
                          }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Examination"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
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
                    type="number"
                    value={investigationTeeth}
                    onChange={(e) => setInvestigationTeeth(e.target.value)}
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
                    onClick={handleAddInvestigation}
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
                  onClick={() =>
                    setShowInvestigationCamera(!showInvestigationCamera)
                  }
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

              {/* Previews */}
              {investigationFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {investigationFiles.map((file, i) => (
                      <div
                        key={i}
                        className="relative border rounded overflow-hidden bg-gray-50"
                      >
                        {file.preview &&
                        (file.preview.startsWith("data:image") ||
                          file.preview.includes("blob:")) ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="object-cover w-full h-32"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32 text-xs text-gray-500">
                            <span>{file.name}</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveInvestigationFile(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {investigations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added Investigations
                  </span>
                  <button
                    onClick={() => {
                      setInvestigations([]);
                      setForm((prev) => ({ ...prev, investigation: [] }));
                    }}
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
                      <div className="text-sm">
                        <strong>Investigation:</strong> {item.investigation}{" "}
                        <br />
                        <strong>Teeth:</strong> {item.teethSpecification}
                      </div>
                      <button
                        onClick={() => {
                          const newItems = investigations.filter(
                            (_, i) => i !== index
                          );
                          setInvestigations(newItems);
                          setForm((prev) => ({
                            ...prev,
                            investigation: newItems,
                          }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Investigation / Finding"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
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
                    type="number"
                    value={diagnosisTeeth}
                    onChange={(e) => setDiagnosisTeeth(e.target.value)}
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
                    onClick={handleAddDiagnosis}
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
                    Added Diagnoses
                  </span>
                  <button
                    onClick={() => {
                      setDiagnoses([]);
                      setForm((prev) => ({ ...prev, diagnosis: [] }));
                    }}
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
                      <div className="text-sm">
                        <strong>Diagnosis:</strong> {item.diagnosis} <br />
                        <strong>Teeth:</strong> {item.teethSpecification}
                      </div>
                      <button
                        onClick={() => {
                          const newItems = diagnoses.filter(
                            (_, i) => i !== index
                          );
                          setDiagnoses(newItems);
                          setForm((prev) => ({ ...prev, diagnosis: newItems }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Diagnosis"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
          </div>
        );

      case "Treatment Plan":
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
                    type="number"
                    value={treatmentTeeth}
                    onChange={(e) => setTreatmentTeeth(e.target.value)}
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

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

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Treatment Plan"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
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
                    type="number"
                    value={procedureTeeth}
                    onChange={(e) => setProcedureTeeth(e.target.value)}
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
                    onClick={handleAddProcedure}
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

              {/* Previews */}
              {procedureFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {procedureFiles.map((file, i) => (
                      <div
                        key={i}
                        className="relative border rounded overflow-hidden bg-gray-50"
                      >
                        {file.preview &&
                        (file.preview.startsWith("data:image") ||
                          file.preview.includes("blob:")) ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="object-cover w-full h-32"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32 text-xs text-gray-500">
                            <span>{file.name}</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveProcedureFile(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {procedures.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Added Procedures
                  </span>
                  <button
                    onClick={() => {
                      setProcedures([]);
                      setForm((prev) => ({ ...prev, procedure: [] }));
                    }}
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
                      <div className="text-sm">
                        <strong>Procedure:</strong> {item.procedure} <br />
                        <strong>Teeth:</strong> {item.teethSpecification}
                      </div>
                      <button
                        onClick={() => {
                          const newItems = procedures.filter(
                            (_, i) => i !== index
                          );
                          setProcedures(newItems);
                          setForm((prev) => ({ ...prev, procedure: newItems }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Procedure"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
          </div>
        );

      case "Medication":
        return (
          <div className="space-y-6">
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
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                              <select
                                value={
                                  [
                                    "1-0-0",
                                    "1-1-0",
                                    "1-1-1",
                                    "0-1-0",
                                    "1-0-1",
                                    "0-0-1",
                                    "0-1-1",
                                  ].includes(med.frequency)
                                    ? med.frequency
                                    : "Other"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updated = [...form.medication];

                                  if (value === "Other") {
                                    updated[index].frequency = "";
                                  } else {
                                    updated[index].frequency = value;
                                  }

                                  setForm({ ...form, medication: updated });
                                }}
                                className="w-full border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="1-0-0">1-0-0</option>
                                <option value="1-1-0">1-1-0</option>
                                <option value="1-1-1">1-1-1</option>
                                <option value="0-1-0">0-1-0</option>
                                <option value="1-0-1">1-0-1</option>
                                <option value="0-0-1">0-0-1</option>
                                <option value="0-1-1">0-1-1</option>
                                <option value="Other">Other</option>
                              </select>

                              {![
                                "1-0-0",
                                "1-1-0",
                                "1-1-1",
                                "0-1-0",
                                "1-0-1",
                                "0-0-1",
                                "0-1-1",
                              ].includes(med.frequency) && (
                                <input
                                  type="text"
                                  value={med.frequency}
                                  onChange={(e) => {
                                    const updated = [...form.medication];
                                    updated[index].frequency = e.target.value;
                                    setForm({ ...form, medication: updated });
                                  }}
                                  placeholder="Custom frequency..."
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                              <select
                                value={
                                  [
                                    "1 Day",
                                    "3 Days",
                                    "5 Days",
                                    "7 Days",
                                    "14 Days",
                                  ].includes(med.duration)
                                    ? med.duration
                                    : "Other"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updated = [...form.medication];

                                  if (value === "Other") {
                                    updated[index].duration = "";
                                  } else {
                                    updated[index].duration = value;
                                  }

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
                                <option value="Other">Other</option>
                              </select>

                              {![
                                "1 Day",
                                "3 Days",
                                "5 Days",
                                "7 Days",
                                "14 Days",
                              ].includes(med.duration) && (
                                <input
                                  type="number"
                                  min="1"
                                  value={med.duration.replace(/\D/g, "")}
                                  onChange={(e) => {
                                    const updated = [...form.medication];
                                    updated[index].duration = e.target.value;
                                    setForm({ ...form, medication: updated });
                                  }}
                                  onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value) {
                                      const updated = [...form.medication];
                                      updated[index].duration = `${value} Days`;
                                      setForm({ ...form, medication: updated });
                                    }
                                  }}
                                  placeholder="Enter days"
                                  className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-col gap-1">
                              <select
                                value={
                                  [
                                    "Before Food",
                                    "After Food",
                                    "sos",
                                    "Other",
                                  ].includes(med.instruction)
                                    ? med.instruction
                                    : "Other"
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updated = [...form.medication];
                                  if (value === "Other") {
                                    updated[index].instruction = [
                                      "Before Food",
                                      "After Food",
                                      "sos",
                                    ].includes(updated[index].instruction)
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
                                <option value="sos">sos</option>
                                <option value="Other">Other</option>
                              </select>
                              {!["Before Food", "After Food"].includes(
                                med.instruction
                              ) && (
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

            {/* Quick Type Section */}
            <QuickTypeSection 
              tab="Advice Instructions"
              quickTypeInputs={quickTypeInputs}
              setQuickTypeInputs={setQuickTypeInputs}
              quickTypes={quickTypes}
              loadingQuickTypes={loadingQuickTypes}
              handleAddQuickType={handleAddQuickType}
              handleDeleteQuickType={handleDeleteQuickType}
              handleUseQuickType={handleUseQuickType}
            />
          </div>
        );

      default:
        return <div className="space-y-6" />;
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      investigationFiles.forEach((f) => {
        if (f?.preview?.startsWith("blob:"))
          try {
            URL.revokeObjectURL(f.preview);
          } catch (e) {}
      });
      procedureFiles.forEach((f) => {
        if (f?.preview?.startsWith("blob:"))
          try {
            URL.revokeObjectURL(f.preview);
          } catch (e) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col">
      <header className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Prescription
          </h1>
          <nav className="text-sm text-blue-600 flex flex-wrap gap-1">
            <span
              onClick={() => navigate("/prescription")}
              className="hover:underline cursor-pointer"
            >
              Home
            </span>
            <span>›</span>
            <span>Prescription</span>
            <span>›</span>
            <span>Add Prescription</span>
          </nav>
        </div>
      </header>

      <div className="px-6 pb-6 flex-1 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg flex flex-col min-h-0">
          <div className="flex flex-col flex-grow">
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

            <div className="p-6 flex-grow overflow-auto">
              {renderTabContent()}
            </div>

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
                  {prescriptionId && (
                    <button
                      onClick={() =>
                        navigate("/invoicing/form", {
                          state: { prescriptionId },
                        })
                      }
                      className="ml-3 px-6 py-2 text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white rounded"
                    >
                      🧾 Create Invoice
                    </button>
                  )}
                </>
              )}

              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default PrescriptionForm;
