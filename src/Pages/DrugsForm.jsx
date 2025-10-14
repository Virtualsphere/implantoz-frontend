import React, { useState, useEffect } from "react";

export default function DrugsForm() {
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState({
    drugName: "",
    generic: "",
    frequency: "",
    duration: "",
    instruction: ""
  });

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    const res = await fetch("http://yourapi.com/api/drugs");
    const data = await res.json();
    setDrugs(data);
  };

  const handleSubmit = async () => {
    await fetch("http://yourapi.com/api/drugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ drugName: "", generic: "", frequency: "", duration: "", instruction: "" });
    fetchDrugs();
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Drug</h2>

      {/* Form */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Drug Name"
          value={form.drugName}
          onChange={(e) => setForm({ ...form, drugName: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Generic"
          value={form.generic}
          onChange={(e) => setForm({ ...form, generic: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Frequency"
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Instruction"
          value={form.instruction}
          onChange={(e) => setForm({ ...form, instruction: e.target.value })}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Drug
      </button>

      {/* Table */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Drugs List</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Drug</th>
            <th className="border px-2 py-1">Generic</th>
            <th className="border px-2 py-1">Frequency</th>
            <th className="border px-2 py-1">Duration</th>
            <th className="border px-2 py-1">Instruction</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{drug.drugName}</td>
              <td className="border px-2 py-1">{drug.generic}</td>
              <td className="border px-2 py-1">{drug.frequency}</td>
              <td className="border px-2 py-1">{drug.duration}</td>
              <td className="border px-2 py-1">{drug.instruction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}