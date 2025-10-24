import React, { useState } from "react";
import Logo from "../assets/logo.png";
import Pic from "../assets/Pic.png";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [form, setForm]= useState({ name:"", email:"", password:"" });
  const [message, setMessage]= useState("");
  const navigate = useNavigate();
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try {
      const res= await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data= await res.json();
      if (res.ok) {
      // ✅ 200–299 response (success)
      setMessage(data.message); // use the message from backend
      setTimeout(() => {
          navigate("/"); // redirect to login
        }, 1500);
      } else {
        // ❌ Backend responded with an error (e.g., 400 or 500)
        setMessage(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong!");
    }
  }
  return (
    <div className="flex h-screen">
      {/* Left Side Form */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md p-6 border border-blue-400 rounded-md shadow-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={Logo}
              alt="logo"
              className="w-12 mb-2"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold mb-1 text-center">Create an account</h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Start your 30-day free trial.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold mb-1">Name*</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={form.name}
              onChange={(e)=>setForm({ ...form, name: e.target.value })}
            />

            <label className="block text-sm font-semibold mb-1">Email*</label>
            <input
              type="email"
              placeholder="Enter your e-mail"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={form.email}
              onChange={(e)=>setForm({ ...form, email: e.target.value })}
            />

            <label className="block text-sm font-semibold mb-1">Password*</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={form.password}
              onChange={(e)=>setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Must be at least 8 characters.
            </p>

            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Get started
            </button>
            {message && <p>{message}</p>}
          </form>

          {/* Divider */}
          <div className="text-center text-gray-500 text-sm my-4">OR</div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-3">
            <button className="flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
                alt="facebook"
                className="w-5 mr-2"
              />
              Facebook
            </button>
            <button className="flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm">
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="google"
                className="w-5 mr-2"
              />
              Google
            </button>
            <button className="flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm">
              <img
                src="https://cdn-icons-png.flaticon.com/512/179/179309.png"
                alt="apple"
                className="w-5 mr-2"
              />
              Apple
            </button>
          </div>

          {/* Login Text */}
          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:flex flex-1">
        <img
          src={Pic}
          alt="Doctors"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
