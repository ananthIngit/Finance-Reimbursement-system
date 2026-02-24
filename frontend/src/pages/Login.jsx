import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // 👈 IMPORT THIS

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      // Ensure this URL matches your Django backend port
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);

      // 3. EXTRACT DATA FROM RESPONSE
      const { access, refresh, role, user_id } = response.data;

      // 4. STORE IN LOCAL STORAGE
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_id', user_id);

      // 5. REDIRECT BASED ON ROLE
      if (role === 'Manager') {
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
    // Main Container: Added 'relative' to position the toggle
    <div className="flex justify-center items-center h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 relative">
      
      {/* 👇 ADD TOGGLE BUTTON HERE 👇 */}
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
            <input 
              type="password" 
              name="password"
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300
                         bg-white border-slate-300 text-slate-900
                         dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
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