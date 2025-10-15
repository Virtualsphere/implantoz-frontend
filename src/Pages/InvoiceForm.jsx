import React, { useState } from 'react'
import axios from 'axios'

const InvoiceForm = () => {
  const [items, setItems] = useState([{ itemName: '', description: '', quantity: '', unitCost: '', tax: '', price: '' }])

  const addItem = () => {
    setItems([...items, { itemName: '', description: '', quantity: '', unitCost: '', tax: '', price: '' }])
  }

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }


  const [form, setForm]= useState({
    patientName: "",
    patientMobile: "",
    patientMail: "",
    doctorName: "",
    invoiceDate: "",
    dueDate: "",
    paymentMethod: "",
    paymentStatus: "",
    invoiceStatus: ""
  })

  const handleInputChange = (e)=>{
    const { name, value }= e.target;
    setForm({ ...form, [name]: value });
  }

  const handleSubmit = async () => {
    try {
      const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

      const payload = { ...form, total: totalAmount, items };

      const res = await fetch("http://localhost:5000/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert('Invoice saved successfully!');
      } else {
        alert(result.message || 'Failed to save invoice.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving invoice.');
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-300 px-6 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-normal text-black">Invoices</h1>
          <div className="flex items-center text-sm text-blue-600">
            <span className="hover:underline cursor-pointer">Home</span>
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
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Payment Method</label>
                <input 
                  type="text"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Payment Status</label>
                <input 
                  type="text"
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Item Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Unit Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-300">Tax</th>
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
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
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
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
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
                  <span className="text-sm"></span>
                </div>
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700">Tax</span>
                  <span className="text-sm"></span>
                </div>
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700">Paid</span>
                  <span className="text-sm"></span>
                </div>
                <div className="p-3 border-b border-gray-200 flex justify-between">
                  <span className="text-sm text-gray-700 font-medium">Total</span>
                  <span className="text-sm font-medium"></span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-sm text-gray-700">Due</span>
                  <span className="text-sm"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-3">
            <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm">
              Save Data
            </button>
            <button
            onClick={()=>{
              handleSubmit();
              setForm({
                patientName: '',
                patientMobile: '',
                patientEmail: '',
                doctorName: '',
                invoiceDate: '',
                dueDate: '',
                paymentMethod: '',
                paymentStatus: '',
                invoiceStatus: ''
              });
              setItems([{ itemName: '', description: '', quantity: '', unitCost: '', tax: '', price: '' }]);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-sm">
              Save & New
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 italic">Powered By Virtualosphere Technologies Pvt Ltd</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceForm