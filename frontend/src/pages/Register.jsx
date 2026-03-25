import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', formData);
      alert('Registration successful! Please log in.');
      navigate('/');
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ non_field_errors: ['Something went wrong. Try again.'] });
      }
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-500 bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-hidden relative">

      {/* ── Global Floating Background Elements ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-500/10 blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12 relative z-10
        bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 border-r border-indigo-500/20 shadow-2xl">

        {/* Decorative elements - Animated floating effects */}
        <div className="absolute top-[10%] right-[15%] w-32 h-32 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl pointer-events-none animate-[bounce_4s_infinite]" />
        <div className="absolute bottom-[20%] left-[10%] w-48 h-48 rounded-full bg-indigo-400/20 backdrop-blur-3xl border border-white/10 shadow-2xl pointer-events-none animate-[bounce_6s_infinite]" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3 w-max group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgb(255,255,255,0.1)] group-hover:shadow-[0_15px_40px_rgb(255,255,255,0.2)] group-hover:bg-white/20 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-extrabold text-2xl tracking-tight">ExpenseFlow</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
            Join your team<br />on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white drop-shadow-lg">ExpenseFlow</span>
          </h2>
          <p className="text-indigo-200/90 text-lg leading-relaxed max-w-sm font-medium">
            Create your account and get started with hassle-free expense management.
          </p>
        </div>

        <p className="relative z-10 text-indigo-300/60 text-sm font-medium hover:text-indigo-300 transition-colors cursor-default">
          © {new Date().getFullYear()} ExpenseFlow. All rights reserved.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto z-20">
        <div className="absolute top-6 right-6 z-50">
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-1">
            <ThemeToggle />
          </div>
        </div>

        <div className="w-full max-w-[440px] relative z-10 perspective-1000 my-8">

          {/* Main Floating Glass Card */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] transform hover:-translate-y-2 transition-all duration-500 ease-out">
            
            {/* Mobile brand */}
            <div className="flex items-center gap-3 mb-8 lg:hidden justify-center group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_8px_20px_rgb(99,102,241,0.4)] group-hover:shadow-[0_12px_25px_rgb(99,102,241,0.6)] group-hover:-translate-y-1 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">ExpenseFlow</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create account</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 font-medium">Fill in the details below to get started</p>
            </div>

            {/* Global error */}
            {error?.non_field_errors && (
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-6 text-sm
                bg-red-50/80 text-red-700 border border-red-100 shadow-md backdrop-blur-sm
                dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-[fade-in_0.3s_ease-out]">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium leading-relaxed">{error.non_field_errors}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Username */}
              <div className="relative group">
                <input
                  type="text" id="username" name="username" value={formData.username}
                  onChange={handleChange} required placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                />
                <label 
                  htmlFor="username" 
                  className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                  peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                >
                  Username
                </label>
                {error?.username && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1 dark:text-red-400">{error.username}</p>}
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type="text" id="first_name" name="first_name" value={formData.first_name}
                    onChange={handleChange} required placeholder=" "
                    className="peer w-full px-4 pt-7 pb-3 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                  />
                  <label 
                    htmlFor="first_name" 
                    className="absolute left-4 top-5 text-slate-500 dark:text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none 
                    peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                    peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                  >
                    First name
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text" id="last_name" name="last_name" value={formData.last_name}
                    onChange={handleChange} required placeholder=" "
                    className="peer w-full px-4 pt-7 pb-3 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                  />
                  <label 
                    htmlFor="last_name" 
                    className="absolute left-4 top-5 text-slate-500 dark:text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none 
                    peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                    peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                  >
                    Last name
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="relative group">
                <input
                  type="email" id="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                  peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                >
                  Email
                </label>
                {error?.email && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1 dark:text-red-400">{error.email}</p>}
              </div>

              {/* Password */}
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password}
                  onChange={handleChange} required placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 pr-14 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                  peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                >
                  Password
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {error?.password && <p className="text-red-500 text-[11px] font-semibold mt-1.5 ml-1 dark:text-red-400">{error.password}</p>}
              </div>

              {/* ── SUPER FLOATING SUBMIT BUTTON ── */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white tracking-wide uppercase
                  bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[length:200%_auto]
                  hover:bg-[position:right_center] focus:outline-none focus:ring-4 focus:ring-indigo-500/30
                  shadow-[0_15px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.7)]
                  transform hover:-translate-y-1.5 active:translate-y-0.5 active:shadow-[0_5px_15px_rgba(99,102,241,0.5)]
                  transition-all duration-300 ease-out mt-6 relative overflow-hidden group"
              >
                {/* Internal shine effect */}
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <span className="flex items-center justify-center gap-2">
                  Create account
                  <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors border-b-2 border-indigo-200 dark:border-indigo-900 hover:border-indigo-600 dark:hover:border-indigo-400 pb-0.5">
                Sign in
              </Link>
            </div>
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

export default Register;
