import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; 

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  // 1. Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Handle Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);

      // 3. EXTRACT DATA FROM RESPONSE
      const { access, refresh, role, user_id } = response.data;

      // 4. STORE IN LOCAL STORAGE
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_id', user_id);

      // 5. REDIRECT BASED ON ROLE
      // 👇 UPDATED: Added the Admin route check right here! 👇
      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (role === 'Manager') {
        navigate('/manager-dashboard');
      } else if (role === 'Finance') {
        navigate('/finance-dashboard');
      } else {
        navigate('/dashboard'); // Default for Employee
      }

    } catch (err) {
      console.error("Login Failed:", err);
      if (err.response && err.response.data.detail) {
          setError(err.response.data.detail);
      } else {
          setError('Invalid Credentials. Please check your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main Container
    <div className="flex justify-center items-center h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 relative">
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="w-96 p-8 shadow-xl rounded-xl border transition-colors duration-300 bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        
        <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to manage your expenses</p>
        </div>
        
        {error && (
            <div className="p-3 rounded-lg text-sm mb-4 border bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm text-slate-700 dark:text-slate-300">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300
                         bg-white border-slate-300 text-slate-900
                         dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1 text-sm text-slate-700 dark:text-slate-300">Password</label>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300
                           bg-white border-slate-300 text-slate-900
                           dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
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

          <div className="flex justify-end mb-6">
            <Link 
                to="/forgot-password" 
                className="text-sm font-medium hover:underline transition-colors
                           text-indigo-600 hover:text-indigo-800 
                           dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white p-2.5 rounded-lg font-bold transition shadow-md hover:shadow-lg
                bg-indigo-600 hover:bg-indigo-700 
                dark:bg-indigo-600 dark:hover:bg-indigo-700
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold hover:underline text-indigo-600 dark:text-indigo-400">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;