import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import Pic from "../assets/Pic.png";
import { useSearchParams, useNavigate } from "react-router-dom";

const SetPass = () => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: form.newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to reset password.");
      } else {
        setMessage(data.message || "Password reset successful!");
        // Optionally redirect to login after a short delay
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

          {error && <p className="text-center text-red-600 mb-4">{error}</p>}
          {message && <p className="text-center text-green-600 mb-4">{message}</p>}

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

            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
              }`}
              disabled={loading || !token}
            >
              {loading ? "Resetting..." : "Set New Password"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            <a href="/" className="text-blue-600 font-medium">← Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPass;
