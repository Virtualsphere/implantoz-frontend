import React from "react";
import Logo from "../assets/logo.png";
import Pic from "../assets/Pic.png";
const ResetPass = () => {
  return (
    <div className="flex h-screen">
      {/* Left Side Image */}
      <div className="hidden md:flex flex-1">
        <img
          src={Pic}
          alt="Doctors"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md px-6">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={Logo}
              alt="logo"
              className="w-12 mb-2"
            />
            
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zM4.93 4.93a10 10 0 0114.14 0M9.17 9.17a6 6 0 018.49 8.49M12 20h.01"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-center mb-2">
            Forgot password?
          </h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            No worries, we’ll send you reset instructions.
          </p>

          {/* Form */}
          <form>
            <label className="block text-sm font-semibold mb-1">Email*</label>
            <input
              type="email"
              placeholder="Enter your e-mail"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <button className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Reset password
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-sm mt-6">
            <a href="#" className="text-blue-600 font-medium">
              ← Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
