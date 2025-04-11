import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const EmailVerification = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password-reset/verify-otp', formData);
            setSuccessMessage(response.data.message);
            setTimeout(() => {
                window.location.href = '/password-reset'; // Redirect to reset password page
            }, 1500);
        } catch (error) {
            setErrorMessage('Invalid OTP. Please try again.');
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
                    Email Verification
                </h2>

                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 text-red-600 text-center bg-red-100 dark:bg-red-900/30 rounded-lg"
                    >
                        {errorMessage}
                    </motion.div>
                )}

                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 text-green-600 text-center bg-green-100 dark:bg-green-900/30 rounded-lg"
                    >
                        {successMessage}
                    </motion.div>
                )}

                <form onSubmit={handleVerify} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            OTP
                        </label>
                        <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                            placeholder="Enter OTP"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 text-white text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transform hover:scale-[1.02] transition-all duration-200"
                    >
                        Verify OTP
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EmailVerification;
