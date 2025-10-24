import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ itemName: '', quantity: '', unitCost: '', discount: '', price: '' }])

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: '', unitCost: '', discount: '', price: '' }])
  }

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }
  const [lastInvoiceId, setLastInvoiceId] = useState(null);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value

    // Calculate price automatically if quantity, unitCost or discount changes
    const quantity = Number(newItems[index].quantity) || 0
    const unitCost = Number(newItems[index].unitCost) || 0
    const discount = Number(newItems[index].discount) || 0
    newItems[index].price = (quantity * unitCost - discount).toFixed(2)

    setItems(newItems)
  }


  const [form, setForm]= useState({
    patientName: "",
    patientMobile: "",
    patientMail: "",
    doctorName: "",
    invoiceDate: "",
    dueDate: "",
    prescriptionId: "",
    paymentStatus: "due",
    invoiceStatus: ""
  })

  const generateInvoicePDF = async (invoiceId) => {
    if (!invoiceId) {
      toast.error("Invoice ID missing");
      return;
    }

    try {
      const response = await fetch(`/api/generate-invoice-pdf/${invoiceId}`, {
        method: 'GET',
        headers: { /* any auth headers if needed */ }
      });
      if (!response.ok) {
        throw new Error('Failed to generate invoice PDF');
      }
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
      if (!prescriptionId) return;

      const res = await axios.get(`/api/prescription/${prescriptionId}`);
      const data = res.data;

      setForm(prev => ({
        ...prev,
        patientName: data.fullName || '',
        patientMobile: data.mobile || '',
        patientMail: data.email || '',
        doctorName: data.doctorName || '',
        prescriptionId: prescriptionId
      }));

      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch prescription details:", error);
      alert('Invalid Prescription Id or server error.');
    }
  };

  const handleInputChange = (e)=>{
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async () => {
    try {
      const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

      const payload = { ...form, total: totalAmount, items };

      const res = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Invoice saved successfully!');
        setLastInvoiceId(result.invoiceId);
      } else {
        alert(result.message || 'Failed to save invoice.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving invoice.');
    }
  };

  const subTotal = items.reduce(
    (sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.unitCost) || 0)),
    0
  )
  const totalDiscount = items.reduce((sum, item) => sum + (Number(item.discount) || 0), 0)
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

  // Set Paid and Due based on paymentStatus
  let paidAmount = 0
  let dueAmount = totalAmount

  if (form.paymentStatus.toLowerCase() === "paid") {
    paidAmount = totalAmount
    dueAmount = 0
  } else if (form.paymentStatus.toLowerCase() === "due") {
    paidAmount = 0
    dueAmount = totalAmount
  }

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Invoices</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span onClick={() => navigate("/invoicing")} className="hover:underline cursor-pointer">Home</span>
            <span className="mx-1">›</span>
            <span>Invoices</span>
            <span className="mx-1">›</span>
            <span>Add Invoices</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Form Fields */}
          <div className="space-y-6">
            {/* First Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mobile No</label>
                <input 
                  type="text"
                  name="patientMobile"
                  value={form.patientMobile}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email"
                  name="patientMail"
                  value={form.patientMail}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid md:grid-cols-3 gap-6">
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
                <div className="relative">
                  <input 
                    type="date"
                    name="invoiceDate"
                    value={form.invoiceDate}
                    onChange={handleInputChange}
                    defaultValue="15-08-2024"
                    className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Due Date</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleInputChange}
                    defaultValue="15-08-2024"
                    className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Consultation Id</label>
                <input 
                  type="text"
                  name="prescriptionId"
                  value={form.prescriptionId}
                  onChange={(e) => {
                    handleInputChange(e)
                    fetchPrescriptionDetails(e.target.value)
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
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'>
                  <option value="paid">paid</option>
                  <option value="due">due</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Invoice Status</label>
                <input 
                  type="text"
                  name="invoiceStatus"
                  value={form.invoiceStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Item Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Unit Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input 
                          type="text" 
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input 
                          type="text" 
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input 
                          type="text" 
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input 
                          type="text" 
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 relative">
                        <input 
                          type="text" 
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-full border-0 focus:outline-none focus:ring-0 pr-16"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-right">
                      <button
                        onClick={addItem}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm mr-2"
                      >
                        Add Item
                      </button>
                      <button
                        onClick={() => deleteItem(items.length - 1)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Delete Last Item
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Add Item Button */}
              <div className="bg-white p-4 border-t border-gray-200">
                <button
                  onClick={addItem}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="mt-6 flex">
            <div className="flex-1"></div>
            <div className="w-64">
              <div className="border border-gray-300 rounded">
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700">Sub Total</span>
                  <span className="text-sm">{subTotal.toFixed(2)}</span>
                </div>
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700">discount</span>
                  <span className="text-sm">{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700">Paid</span>
                  <span className="text-sm">{paidAmount.toFixed(2)}</span>
                </div>
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700 font-medium">Total</span>
                  <span className="text-sm font-medium">{totalAmount.toFixed(2)}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-sm text-gray-700">Due</span>
                  <span className="text-sm">{dueAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-3">
            <button
            onClick={()=>{
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
              setItems([{ itemName: '', description: '', quantity: '', unitCost: '', discount: '', price: '' }]);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-sm">
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
          <p className="text-sm text-gray-600 italic">Powered By Virtualosphere Technologies Pvt Ltd</p>
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
  )
}

export default InvoiceForm