import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // 👈 IMPORT THIS

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('password-reset/', { email });
            setMessage("If an account with that email exists, we have sent a verification link.");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main Container: Added 'relative' to position the toggle button
        <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 relative">
            
            {/* 👇 ADD TOGGLE BUTTON HERE 👇 */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Card */}
            <div className="w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 bg-white dark:bg-gray-800">
                
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Reset Password
                </h2>
                
                {message ? (
                    <div className="text-center">
                        <div className="p-4 rounded mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {message}
                        </div>
                        <button 
                            onClick={() => navigate('/')} 
                            className="font-medium hover:underline text-indigo-600 dark:text-indigo-400"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-2 rounded text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                                Enter your email
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300
                                           bg-white border-gray-300 text-gray-900
                                           dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                required
                                placeholder="john@example.com"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full text-white py-2 rounded-lg font-bold transition shadow-md
                                bg-indigo-600 hover:bg-indigo-700 
                                dark:bg-indigo-600 dark:hover:bg-indigo-700
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center mt-4">
                            <button 
                                type="button" 
                                onClick={() => navigate('/')} 
                                className="text-sm transition-colors text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;