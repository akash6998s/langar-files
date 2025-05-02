import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import admin from '../../data/admin.json'; // Assuming admin data is in this file

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook for redirection

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the entered id and password match admin_login
    if (emailOrPhone === admin.admin_login.id && password === admin.admin_login.password) {
      // Redirect to dashboard if credentials are correct
      navigate("/dashboard");
    } else {
      // Show error message if credentials are incorrect
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">🙏 स्वागत है</h1>
          <p className="text-gray-600 text-sm">सेवा में जुड़ने के लिए कृपया लॉगिन करें</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">ईमेल / मोबाइल</label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="उदाहरण: seva@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">पासवर्ड</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="********"
            />
          </div>
          
          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
          >
            लॉगिन करें
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            नया सदस्य? <a href="/signup" className="text-purple-600 font-semibold">रजिस्टर करें</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
