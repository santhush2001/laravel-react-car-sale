import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/password-reset/send-otp", { email });

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: response.data.message,
      }).then(() => {
        navigate("/email-verification"); // Redirect to EmailVerification.jsx after SweetAlert
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: "An error occurred while sending the OTP. Please try again.",
      });
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl dark:bg-gray-800/80 dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transform hover:scale-[1.02] transition-all duration-200"
          >
            Send OTP
          </button>
        </form>

        <div className="space-y-3 pt-4">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <a
              href="/signin"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
            >
              Sign In
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgetPassword;
