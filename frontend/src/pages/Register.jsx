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
    <div className="min-h-screen flex transition-colors duration-300 bg-slate-50 dark:bg-slate-950">

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12
        bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 relative overflow-hidden">

        <div className="absolute top-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">ExpenseFlow</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Join your team<br />on ExpenseFlow
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
            Create your account and get started with hassle-free expense management.
          </p>
        </div>

        <p className="relative z-10 text-indigo-400 text-xs">
          © {new Date().getFullYear()} ExpenseFlow. All rights reserved.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-[420px] animate-slide-up">

          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-base">ExpenseFlow</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in the details below to get started</p>
          </div>

          {/* Global error */}
          {error?.non_field_errors && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5 text-sm
              bg-red-50 text-red-700 border border-red-100
              dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50 animate-fade-in">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error.non_field_errors}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <input
                type="text" name="username" placeholder="Choose a username"
                onChange={handleChange} required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-200
                  bg-white border-slate-300 text-slate-900 placeholder-slate-400
                  dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {error?.username && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error.username}</p>}
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First name</label>
                <input
                  type="text" name="first_name" placeholder="First"
                  onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-200
                    bg-white border-slate-300 text-slate-900 placeholder-slate-400
                    dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last name</label>
                <input
                  type="text" name="last_name" placeholder="Last"
                  onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-200
                    bg-white border-slate-300 text-slate-900 placeholder-slate-400
                    dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                type="email" name="email" placeholder="you@company.com"
                onChange={handleChange} required
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-200
                  bg-white border-slate-300 text-slate-900 placeholder-slate-400
                  dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {error?.email && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" placeholder="Min. 8 characters"
                  onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 pr-11 text-sm rounded-lg border transition-all duration-200
                    bg-white border-slate-300 text-slate-900 placeholder-slate-400
                    dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {error?.password && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white
                bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                transition-all duration-200 shadow-sm hover:shadow-md mt-1"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
