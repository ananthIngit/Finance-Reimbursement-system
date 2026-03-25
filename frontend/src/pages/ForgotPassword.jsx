import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

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
    <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-500 bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden relative selection:bg-indigo-500/30">

      {/* ── Global Floating Background Elements ── */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-500/10 blur-[100px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />

      <div className="absolute top-6 right-6 z-50">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-1">
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-[440px] relative z-10 perspective-1000">
        
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-10 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_8px_20px_rgb(99,102,241,0.4)] group-hover:shadow-[0_12px_25px_rgb(99,102,241,0.6)] group-hover:-translate-y-1 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">ExpenseFlow</span>
        </div>

        {/* Main Floating Glass Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-white/50 dark:border-slate-700/50 transform hover:-translate-y-2 transition-all duration-500 ease-out">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-2 tracking-tight">
            {stepTitles[step]}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center mb-8">
            {step === 1
              ? 'Enter your email and we\'ll send a verification code.'
              : otpVerified
              ? 'Choose a strong new password for your account.'
              : 'Enter the 6-digit code sent to your inbox.'}
          </p>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl text-sm font-medium
              bg-red-50/80 text-red-700 border border-red-100 shadow-md backdrop-blur-sm
              dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-[fade-in_0.3s_ease-out]">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          {message && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl text-sm font-medium
              bg-emerald-50/80 text-emerald-700 border border-emerald-100 shadow-md backdrop-blur-sm
              dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 animate-[fade-in_0.3s_ease-out]">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="relative group">
                <input
                  type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 text-base font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-base font-medium transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                  peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                >
                  Email address
                </label>
              </div>
              <button
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white tracking-wide uppercase
                    bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[length:200%_auto]
                    hover:bg-[position:right_center] focus:outline-none focus:ring-4 focus:ring-indigo-500/30
                    shadow-[0_15px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.7)]
                    transform hover:-translate-y-1.5 active:translate-y-0.5 active:shadow-[0_5px_15px_rgba(99,102,241,0.5)]
                    transition-all duration-300 ease-out relative overflow-hidden group disabled:opacity-60 disabled:pointer-events-none"
              >
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                {loading ? 'Sending…' : 'Send verification code'}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              
              {!otpVerified ? (
                <div className="space-y-6 animate-[fade-in_0.4s_ease-out]">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2.5 text-center">
                      6-digit code
                    </label>
                    <input
                      type="text" maxLength="6" disabled={otpVerified} value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="——————"
                      className={`w-full px-5 py-4 rounded-2xl border-2 text-center text-3xl tracking-[0.5em] font-mono font-bold
                        focus:outline-none transition-all duration-300
                        ${otpVerified
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                          : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]'
                        }`}
                    />
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={handleVerifyOTP} disabled={loading}
                      className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white tracking-wide uppercase
                        bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[length:200%_auto] hover:bg-[position:right_center]
                        shadow-[0_15px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.7)]
                        transform hover:-translate-y-1.5 transition-all duration-300 ease-out relative overflow-hidden group disabled:opacity-60 disabled:pointer-events-none"
                    >
                      <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                      {loading ? 'Verifying…' : 'Verify code'}
                    </button>
                    <button
                      type="button" onClick={() => setStep(1)}
                      className="w-full py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      ← Change email address
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6 animate-[fade-in_0.4s_ease-out]">
                  <div className="relative group">
                    <input
                      type="password" id="newpass" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder=" "
                      className="peer w-full px-5 pt-7 pb-3 text-base font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)]"
                    />
                    <label 
                      htmlFor="newpass" 
                      className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-base font-medium transition-all duration-300 pointer-events-none 
                      peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-emerald-400
                      peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-600 dark:peer-[:not(:placeholder-shown)]:text-emerald-400"
                    >
                      New password
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="password" id="confirmpass" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder=" "
                      className="peer w-full px-5 pt-7 pb-3 text-base font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)]"
                    />
                    <label 
                      htmlFor="confirmpass" 
                      className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-base font-medium transition-all duration-300 pointer-events-none 
                      peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-emerald-600 dark:peer-focus:text-emerald-400
                      peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-600 dark:peer-[:not(:placeholder-shown)]:text-emerald-400"
                    >
                      Confirm new password
                    </label>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white tracking-wide uppercase
                      bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-[length:200%_auto] hover:bg-[position:right_center]
                      shadow-[0_15px_30px_-10px_rgba(16,185,129,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.7)]
                      transform hover:-translate-y-1.5 transition-all duration-300 ease-out relative overflow-hidden group disabled:opacity-60 disabled:pointer-events-none"
                  >
                    <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                    {loading ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link to="/" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(150%) skewX(30deg); } }
        @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default ForgotPassword;
