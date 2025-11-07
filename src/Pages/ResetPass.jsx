import React, { useState } from "react";
import Logo from "../assets/logo.png";
import Pic from "../assets/Pic.png";
import { API_BASE } from '../config/api';

const ResetPass = () => {
  const [form, setForm] = useState({ email: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });

      const data = await res.json();
      setMessage(data.message || "Check your email for reset instructions.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side Image */}
      <div className="hidden md:flex flex-1">
        <img src={Pic} alt="Doctors" className="w-full h-full object-cover" />
      </div>

      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md px-6">
          <div className="flex flex-col items-center mb-8">
            <img src={Logo} alt="logo" className="w-12 mb-2" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Forgot password?</h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            No worries, we’ll send you reset instructions.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold mb-1">Email*</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your e-mail"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              required
            />

            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Reset password
            </button>
          </form>

          {message && <p className="text-center text-green-600 mt-4">{message}</p>}

          <p className="text-center text-sm mt-6">
            <a href="/" className="text-blue-600 font-medium">← Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;