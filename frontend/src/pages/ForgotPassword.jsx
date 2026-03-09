import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Request Email, 2: Verify & Reset
    const [otpVerified, setOtpVerified] = useState(false); // Gatekeeper state
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Request OTP Email
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await api.post('auth/request-otp/', { email });
            setMessage('A 6-digit code has been sent to your email.');
            setStep(2);
        } catch (err) {
            setError('Failed to send OTP. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    // Intermediate Step: Verify OTP only
    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            // This calls the new backend endpoint we discussed
            await api.post('auth/verify-otp/', { email, otp });
            setOtpVerified(true);
            setMessage('OTP Verified! You can now set your new password.');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Final Step: Update the Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('auth/reset-password-otp/', { 
                email, 
                otp, 
                new_password: newPassword 
            });
            alert('Password reset successful! Redirecting to login...');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-slate-900 px-4">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    {step === 1 ? 'Reset Password' : otpVerified ? 'Update Password' : 'Verify OTP'}
                </h2>

                {error && (
                    <div className="p-3 mb-4 bg-red-900/30 text-red-400 border border-red-900/50 rounded text-sm text-center animate-pulse">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="p-3 mb-4 bg-green-900/30 text-green-400 border border-green-900/50 rounded text-sm text-center">
                        {message}
                    </div>
                )}

                {/* STEP 1: EMAIL INPUT */}
                {step === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <div>
                            <label className="text-slate-300 text-sm font-bold">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="pablo12082004@gmail.com"
                            />
                        </div>
                        <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
                            {loading ? 'Processing...' : 'Send Verification Code'}
                        </button>
                    </form>
                )}

                {/* STEP 2: OTP VERIFICATION & PASSWORD RESET */}
                {step === 2 && (
                    <div className="space-y-6">
                        {/* OTP Input Section */}
                        <div>
                            <label className="text-slate-300 text-sm font-bold block text-center mb-2">6-Digit Code</label>
                            <input 
                                type="text" 
                                maxLength="6"
                                disabled={otpVerified}
                                className={`w-full p-3 bg-slate-700 border rounded-lg text-white text-center text-2xl tracking-[0.5em] outline-none transition-all ${
                                    otpVerified ? 'border-green-500 bg-green-900/10 text-green-400' : 'border-slate-600 focus:ring-2 focus:ring-indigo-500'
                                }`}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="------"
                            />
                        </div>

                        {/* Switch between Verify Button and Password Form */}
                        {!otpVerified ? (
                            <div className="space-y-4">
                                <button 
                                    onClick={handleVerifyOTP} 
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP Code'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)} 
                                    className="w-full text-slate-400 text-sm hover:underline"
                                >
                                    Change email address
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in duration-500">
                                <div>
                                    <label className="text-slate-300 text-sm font-bold">New Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-green-500"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-bold">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-green-500"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Repeat new password"
                                    />
                                </div>
                                <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-green-900/20">
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                    <Link to="/" className="text-slate-400 text-sm hover:text-white transition">
                        Cancel & Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;