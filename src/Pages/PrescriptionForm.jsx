import React, { useState } from 'react'
import { Calendar } from "lucide-react";
import ToothIcon from '../assets/tooth.png';

const PrescriptionForm = () => {
  const [activeTab, setActiveTab] = useState('Chief Complaint')
  const [examinations, setExaminations] = useState([])
  const [investigation, setInvestigation]= useState([])
  const [diagnosis, setDiagnosis]= useState([])
  const [treatmentPlan, setTreatmentPlan]= useState([])
  const [procedure, setProcedure]= useState([])
  const [adviceInstructios,setAdviceInstruction]= useState([])
  const [examinationInput, setExaminationInput] = useState('')
  const [investigationInput, setInvestigationInput]= useState('')
  const [diagnosisInput, setDiagnosisInput]= useState('')
  const [treatmentPlanInput, setTreatmentPlanInput]= useState('')
  const [procedureInput, setProcedureInput]= useState('')
  const [adviceInstructiosInput,setAdviceInstructionInput]= useState('')
  const [addedItems, setAddedItems] = useState('')

  const tabs = [
    'Chief Complaint',
    'Examination', 
    'Investigation / Finding',
    'Diagnosis',
    'Treatment Plan',
    'Procedure',
    'Medication',
    'Advice Instructions'
  ]

  const handleAddExamination = () => {
    if (examinationInput.trim()) {
      const newItem = examinationInput.trim()
      setAddedItems([...addedItems, newItem])
      setExaminationInput('')
    }
    if (investigationInput.trim()){
      const newItem= investigationInput.trim()
      setAddedItems([...addedItems, newItem])
      setInvestigationInput('')
    }
    if(diagnosisInput.trim()){
      const newItem= diagnosisInput.trim()
      setAddedItems([...addedItems, newItem])
      setDiagnosisInput('')
    }
    if(treatmentPlanInput.trim()){
      const newItem= diagnosisInput.trim()
      setAddedItems([...addedItems, newItem])
      setTreatmentPlanInput('')
    }
  }

  const handleRemoveItem = (index) => {
    const newItems = addedItems.filter((_, i) => i !== index)
    setAddedItems(newItems)
  }

  const clearAll = () => {
    setAddedItems([])
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Chief Complaint':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Teeth Specification</label>
                <div className="flex items-center space-x-2 relative">
                  <img src={ToothIcon} alt="" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-4">Chief Complaint</label>
              <textarea 
                rows={6}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )
      
      case 'Examination':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Teeth Specification</label>
                <div className="flex items-center space-x-2 relative">
                  <img src={ToothIcon} alt="" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Add Examinations</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  value={examinationInput}
                  onChange={(e) => setExaminationInput(e.target.value)}
                  placeholder="Add Examinations"
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

            {addedItems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Added</span>
                  <button 
                    onClick={clearAll}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-2">
                  {addedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item}</span>
                      <button 
                        onClick={() => handleRemoveItem(index)}
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
              <label className="block text-sm text-gray-700 mb-2">Quick Type</label>
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
        )

      case 'Investigation / Finding':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Teeth Specification</label>
                <div className="flex items-center space-x-2 relative">
                  <img src={ToothIcon} alt="" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Add Investigation</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  placeholder="Add investigation..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Quick Type</label>
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
        )
      
      case 'Diagnosis':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Teeth Specification</label>
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    8/1
                  </button>
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Add Diagnosis</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  placeholder="Add diagnosis..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Quick Type</label>
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
        )

      case 'Treatment Plan':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Teeth Specification</label>
                <div className="flex items-center space-x-2 relative">
                  <img src={ToothIcon} alt="" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Add Procedure Details</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    placeholder="Procedure Details..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex lg:items-end md:items-end flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input 
                  type="date"
                  className="flex border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="pl-6 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Quick Type</label>
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
        )

      case 'Advice Instructions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Advice/Instructions</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  placeholder="Type Advice/Instructions..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Quick Type</label>
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
        )

      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Patient Mail Id</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Teeth Specification</label>
                <div className="flex items-center space-x-2 relative">
                  <img src={ToothIcon} alt="" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-gray-300 min-h-screen">
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
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-lg">
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
          
          {/*
          <div className='relative overflow-hidden'>
            <div className='flex transition-transform duration-500'
            style={{ transform: `translateX(-${tabs.indexOf(activeTab) * 100}%)` }}>
            {
              tabs.map((tab)=>(
                <div key={tab} className='w-full flex-shrink-0 px-6 py-4'>
                  {activeTab === tab && renderTabContent()}
                </div>
              ))
            }
            </div>
          </div>
          */}
          
          {/* Content */}
          <div className="p-6">{renderTabContent()}</div>

          {/* Save Button */}
          <div className="px-6 pb-6">
            <button className="flex-shrink-0 px-4 py-3 text-sm font-medium ... bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm">
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionForm