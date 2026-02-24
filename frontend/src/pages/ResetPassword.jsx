import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // 👈 IMPORT THIS

const ResetPassword = () => {
    // 1. Get the UID and Token from the URL parameters
    const { uid, token } = useParams(); 
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // 👇 NEW: States to track password visibility for both fields
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 2. Client-side Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            // 3. Send the API Request
            await api.patch('password-reset-complete/', {
                password: password,
                token: token,
                uidb64: uid 
            });

            setMessage("Password reset successful! Redirecting to login...");
            
            // 4. Redirect after success
            setTimeout(() => navigate('/'), 3000);

        } catch (err) {
            console.error("Reset Error:", err);
            
            // 5. Smart Error Handling
            const backendMsg = err.response?.data?.detail || 
                               err.response?.data?.error || 
                               err.response?.data?.non_field_errors?.[0];

            setError(backendMsg || "Invalid link or link has expired. Please request a new one.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main Container: Added 'relative' for positioning the toggle
        <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 relative">
            
            {/* 👇 ADD TOGGLE BUTTON HERE 👇 */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Card */}
            <div className="w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 bg-white dark:bg-gray-800">
                
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Set New Password
                </h2>

                {message ? (
                    <div className="p-4 rounded-lg text-center shadow-inner mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <p className="font-bold mb-2">Success!</p>
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg text-sm border bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50">
                                {error}
                            </div>
                        )}

                        {/* NEW PASSWORD FIELD */}
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            {/* 👇 UPDATED: Relative wrapper for the eye icon 👇 */}
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300
                                               bg-white border-gray-300 text-gray-900
                                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    required
                                    placeholder="******"
                                />
                                {/* Eye Icon Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* CONFIRM NEW PASSWORD FIELD */}
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            {/* 👇 UPDATED: Relative wrapper for the eye icon 👇 */}
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300
                                               bg-white border-gray-300 text-gray-900
                                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    required
                                    placeholder="******"
                                />
                                {/* Eye Icon Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-2.5 rounded-lg font-bold text-white transition shadow-md
                                bg-indigo-600 hover:bg-indigo-700 
                                dark:bg-indigo-500 dark:hover:bg-indigo-600
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;