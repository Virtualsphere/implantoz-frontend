import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import Pic from "../assets/Pic.png";
import { useSearchParams } from "react-router-dom";

const SetPass = () => {
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailFromURL = searchParams.get("email");
    if (emailFromURL) {
      setForm((prev) => ({ ...prev, email: emailFromURL }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`http://103.118.16.129:5005/auth/reset-password?email=${form.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: form.newPassword })
      });

      const data = await res.json();
      setMessage(data.message || "Password reset successful!");
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

          <h1 className="text-2xl font-bold text-center mb-2">Reset your password</h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Set your new password below.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold mb-1">New Password*</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              required
            />

            <label className="block text-sm font-semibold mb-1">Confirm Password*</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm password"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              required
            />

            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Set New Password
            </button>
          </form>

          {message && <p className="text-center text-green-600 mt-4">{message}</p>}

          <p className="text-center text-sm mt-6">
            <a href="/" className="text-blue-600 font-medium">← Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPass;
