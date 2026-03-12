import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [otpVerified, setOtpVerified] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const stepTitles = { 1: 'Reset password', 2: otpVerified ? 'Set new password' : 'Verify your email' };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      await api.post('auth/request-otp/', { email });
      setMessage('A 6-digit code has been sent to your email address.');
      setStep(2);
    } catch {
      setError('Failed to send OTP. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2a: Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { setError('Please enter a valid 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('auth/verify-otp/', { email, otp });
      setOtpVerified(true);
      setMessage('Code verified! You can now set your new password.');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2b: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('auth/reset-password-otp/', { email, otp, new_password: newPassword });
      alert('Password reset successful! Redirecting to login…');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-slate-950 dark:bg-slate-950 transition-colors">

      <div className="w-full max-w-[420px] animate-slide-up">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">ExpenseFlow</span>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white text-center mb-1">
            {stepTitles[step]}
          </h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            {step === 1
              ? 'Enter your email and we\'ll send a verification code.'
              : otpVerified
              ? 'Choose a strong new password for your account.'
              : 'Enter the 6-digit code sent to your inbox.'}
          </p>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg text-sm
              bg-red-950/50 text-red-400 border border-red-900/50 animate-fade-in">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          {message && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg text-sm
              bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 animate-fade-in">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border
                    bg-slate-800 border-slate-700 text-white placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <button
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white
                  bg-indigo-600 hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send verification code'}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              {/* OTP input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 text-center">
                  6-digit code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  disabled={otpVerified}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="——————"
                  className={`w-full px-4 py-3 rounded-lg border text-center text-2xl tracking-[0.6em] font-mono
                    focus:outline-none transition
                    ${otpVerified
                      ? 'bg-emerald-950/20 border-emerald-700 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                />
              </div>

              {!otpVerified ? (
                <div className="space-y-3">
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white
                      bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying…' : 'Verify code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm text-slate-500 hover:text-slate-300 transition"
                  >
                    ← Change email address
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4 animate-slide-up">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border
                        bg-slate-800 border-slate-700 text-white placeholder-slate-500
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border
                        bg-slate-800 border-slate-700 text-white placeholder-slate-500
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white
                      bg-emerald-600 hover:bg-emerald-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-7 pt-5 border-t border-slate-800 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
