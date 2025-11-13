import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_BASE } from '../config/api';

const InvoiceForm = () => {
  const location = useLocation();
  const { prescriptionId } = location.state || {};
  const navigate = useNavigate();
  const [items, setItems] = useState([{ itemName: '', quantity: '', unitCost: '', discount: '', price: '' }]);
  const [lastInvoiceId, setLastInvoiceId] = useState(null);

  const addItem = () => setItems([...items, { itemName: '', quantity: '', unitCost: '', discount: '', price: '' }]);
  const deleteItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    const quantity = Number(newItems[index].quantity) || 0;
    const unitCost = Number(newItems[index].unitCost) || 0;
    const discount = Number(newItems[index].discount) || 0;
    newItems[index].price = (quantity * unitCost - discount).toFixed(2);
    setItems(newItems);
  };

  const [form, setForm] = useState({
    patientName: "",
    patientMobile: "",
    patientMail: "",
    doctorName: "",
    invoiceDate: "",
    dueDate: "",
    prescriptionId: "",
    paymentStatus: "due",
    invoiceStatus: ""
  });

  const generateInvoicePDF = async (invoiceId) => {
    if (!invoiceId) return toast.error("Invoice ID missing");
    try {
      const response = await fetch(`${API_BASE}/api/generate-invoice-pdf/${invoiceId}`);
      if (!response.ok) throw new Error('Failed to generate invoice PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch invoice PDF');
    }
  };

  const fetchPrescriptionDetails = async (prescriptionId) => {
    try {
      if (!prescriptionId) {
        // 🔹 Clear data when the ID is removed
        setForm(prev => ({
          ...prev,
          patientName: '',
          patientMobile: '',
          patientMail: '',
          doctorName: '',
          prescriptionId: ''
        }));
        setItems([{ itemName: '', quantity: '', unitCost: '', discount: '', price: '' }]);
        return;
      }
      const res = await axios.get(`${API_BASE}/api/prescription/${prescriptionId}`);
      const data = res.data;
      setForm(prev => ({
        ...prev,
        patientName: data.fullName || '',
        patientMobile: data.mobile || '',
        patientMail: data.email || '',
        doctorName: data.doctorName || '',
        prescriptionId
      }));
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch prescription details:", error);
      setForm(prev => ({
        ...prev,
        patientName: '',
        patientMobile: '',
        patientMail: '',
        doctorName: '',
        prescriptionId
      }));
      setItems([{ itemName: '', quantity: '', unitCost: '', discount: '', price: '' }]);
    }
  };

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescriptionDetails(prescriptionId);
    }
  }, [prescriptionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'prescriptionId' && value.trim() === '') {
      setForm(prev => ({
        ...prev,
        patientName: '',
        patientMobile: '',
        patientMail: '',
        doctorName: '',
        prescriptionId: ''
      }));
      setItems([{ itemName: '', quantity: '', unitCost: '', discount: '', price: '' }]);
    }
  };

  const handleSubmit = async () => {
    try {
      const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      const payload = { ...form, total: totalAmount, items };
      const res = await fetch(`${API_BASE}/api/create-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Invoice saved successfully!');
        setLastInvoiceId(result.invoiceId);
      } else toast.error(result.message || 'Failed to save invoice.');
    } catch (error) {
      console.error(error);
      toast.error('Error saving invoice.');
    }
  };

  const subTotal = items.reduce((sum, item) => sum + ((+item.quantity || 0) * (+item.unitCost || 0)), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (+item.discount || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + (+item.price || 0), 0);
  const paidAmount = form.paymentStatus.toLowerCase() === "paid" ? totalAmount : 0;
  const dueAmount = form.paymentStatus.toLowerCase() === "paid" ? 0 : totalAmount;

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header */}
      <div className="bg-gray-300 px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
          <h1 className="text-2xl md:text-3xl font-normal text-black">Invoices</h1>
          <div className="flex flex-wrap items-center text-sm text-blue-600 space-x-1">
            <span onClick={() => navigate("/invoicing")} className="hover:underline cursor-pointer">Home</span>
            <span>›</span>
            <span>Invoices</span>
            <span>›</span>
            <span>Add Invoices</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          {/* Form Fields */}
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Patient Name", name: "patientName" },
                { label: "Patient Mobile No", name: "patientMobile" },
                { label: "Patient Mail Id", name: "patientMail", type: "email" }
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm text-gray-700 mb-2">{f.label}</label>
                  <input
                    type={f.type || "text"}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Doctor & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input
                  type="text"
                  name="doctorName"
                  value={form.doctorName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Invoice Date</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={form.invoiceDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Prescription & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Consultation Id</label>
                <input
                  type="text"
                  name="prescriptionId"
                  value={form.prescriptionId}
                  onChange={(e) => {
                    handleInputChange(e);
                    fetchPrescriptionDetails(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="paid">Paid</option>
                  <option value="due">Due</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Invoice Status</label>
                <select
                  name="invoiceStatus"
                  value={form.invoiceStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[800px] border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {["Service", "Quantity", "Unit Cost", "Discount", "Price"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    {["itemName", "quantity", "unitCost", "discount", "price"].map((field) => (
                      <td key={field} className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="text"
                          value={item[field]}
                          onChange={(e) => handleItemChange(index, field, e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <button onClick={addItem} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
                Add Item
              </button>
              <button
                onClick={() => deleteItem(items.length - 1)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                Delete Last Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-end">
            <div className="w-full sm:w-72 border border-gray-300 rounded">
              {[
                ["Sub Total", subTotal],
                ["Discount", totalDiscount],
                ["Paid", paidAmount],
                ["Total", totalAmount],
                ["Due", dueAmount],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  className={`p-3 flex justify-between ${i !== 4 ? "border-b border-gray-200" : ""}`}
                >
                  <span className={`text-sm ${i === 3 ? "font-medium" : "text-gray-700"}`}>{label}</span>
                  <span className={`text-sm ${i === 3 ? "font-medium" : ""}`}>{val.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                handleSubmit();
                setForm({
                  patientName: '',
                  patientMobile: '',
                  patientMail: '',
                  doctorName: '',
                  invoiceDate: '',
                  dueDate: '',
                  prescriptionId: '',
                  paymentStatus: '',
                  invoiceStatus: ''
                });
                setItems([{ itemName: '', quantity: '', unitCost: '', discount: '', price: '' }]);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-sm"
            >
              Save & New
            </button>
            {lastInvoiceId && (
              <button
                onClick={() => generateInvoicePDF(lastInvoiceId)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded text-sm"
              >
                Generate Invoice PDF
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 italic">
            Powered By Virtualosphere Technologies Pvt Ltd
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default InvoiceForm;
