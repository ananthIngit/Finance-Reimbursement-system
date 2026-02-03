import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
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
    setError(''); // Clear previous errors

    try {
      // ✅ FIX: Updated URL to match your urls.py (api/auth/login/)
      // We assume your main project urls.py includes these under 'api/'
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);

      // 3. EXTRACT DATA FROM RESPONSE
      const { access, refresh, role, user_id } = response.data;

      // 4. STORE IN LOCAL STORAGE
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_id', user_id);

      // 5. REDIRECT BASED ON ROLE
      alert('Login Successful!');
      if (role === 'Manager') {
        navigate('/manager-dashboard');
      } else if (role === 'Finance') {
        navigate('/finance-dashboard');
      } else {
        navigate('/dashboard'); // Default for Employee
      }

    } catch (err) {
      console.error("Login Failed:", err);
      // specific error handling if backend sends "detail"
      if (err.response && err.response.data.detail) {
          setError(err.response.data.detail);
      } else {
          setError('Invalid Credentials. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Expense Login</h2>
        
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;