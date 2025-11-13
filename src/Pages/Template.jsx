import React, { useEffect, useState } from "react";
import { API_BASE } from "../config/api";

const Template = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/get-template`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTemplates(data.templates);
      });
  }, []);

  const handleSelect = async (id) => {
    await fetch(`${API_BASE}/api/select-template/${id}`, { method: "POST" });
    setTemplates((prev) =>
      prev.map((t) => ({ ...t, status: t.id === id ? "active" : "inactive" }))
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {templates.map((t) => (
        <div
          key={t.id}
          className={`p-4 border rounded-lg cursor-pointer transition ${
            t.status === "active" ? "border-blue-500 shadow-lg" : "border-gray-300"
          }`}
          onClick={() => handleSelect(t.id)}
        >
          <img src={t.image_url} alt={t.name} className="w-full rounded-lg" />
          <p className="text-center mt-2 font-semibold capitalize">{t.name}</p>
          {t.status === "active" && (
            <p className="text-green-600 text-center font-bold">Active</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Template;
