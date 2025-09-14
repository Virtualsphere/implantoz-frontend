import React from "react";
import Logo from '../assets/logo.png';
import Pic from '../assets/Pic.png'

const Signin = () => {
  return (
    <div className="flex h-screen">
      {/* Left Side */}
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
          <h1 className="text-xl font-bold mb-1 text-center">
            Sign in to your account
          </h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Welcome back! Please enter your details.
          </p>

          {/* Form */}
          <form>
            <label className="block text-sm font-semibold mb-1">Email*</label>
            <input
              type="email"
              placeholder="Enter your e-mail"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="block text-sm font-semibold mb-1">Password*</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Must be at least 8 characters.
            </p>

            <button className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Log in
            </button>
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

          {/* Signup Redirect */}
          <p className="text-center text-sm mt-6">
            I don’t have an account?{" "}
            <a href="#" className="text-blue-600 font-medium">
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

export default Signin;
