import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; // 👈 IMPORT THIS

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department: '' // Optional field from your model
  });
  
  const [error, setError] = useState(null);
  
  // 👇 NEW: State to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // HIT THE REGISTER ENDPOINT
      await axios.post('http://127.0.0.1:8000/api/register/', formData);
      
      alert('Registration Successful! Please login.');
      navigate('/'); // Redirect to Login Page

    } catch (err) {
      // Handle Django Validation Errors (e.g., "Username already exists")
      if (err.response && err.response.data) {
        setError(err.response.data); // Capture specific field errors
      } else {
        setError({ non_field_errors: ["Something went wrong. Try again."] });
      }
    }
  };

  return (
    // Main Container: Adapts background color
    <div className="flex justify-center items-center h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900 relative">
      
      {/* 👇 ADD TOGGLE BUTTON HERE 👇 */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Card: Adapts background and text colors */}
      <div className="w-96 p-6 shadow-lg rounded-md transition-colors duration-300 bg-white dark:bg-gray-800">
        
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Create Account
        </h2>

        {/* Global Error Message */}
        {error?.non_field_errors && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-center dark:bg-red-900/30 dark:text-red-400 dark:border-red-900">
            {error.non_field_errors}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* USERNAME */}
          <div className="mb-3">
            <input 
              type="text" name="username" placeholder="Username"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300
                         bg-white border-gray-300 text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              onChange={handleChange} required
            />
            {error?.username && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error.username}</p>}
          </div>

          {/* NAME FIELDS */}
          <div className="flex gap-2 mb-3">
            <div className="w-1/2">
                <input 
                type="text" name="first_name" placeholder="First Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300
                            bg-white border-gray-300 text-gray-900
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                onChange={handleChange} required
                />
            </div>
            <div className="w-1/2">
                <input 
                type="text" name="last_name" placeholder="Last Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300
                            bg-white border-gray-300 text-gray-900
                            dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                onChange={handleChange} required
                />
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <input 
              type="email" name="email" placeholder="Email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300
                         bg-white border-gray-300 text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              onChange={handleChange} required
            />
            {error?.email && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            {/* 👇 UPDATED: Relative wrapper for the eye icon 👇 */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // Dynamic type
                name="password" placeholder="Password"
                className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300
                           bg-white border-gray-300 text-gray-900
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                onChange={handleChange} required
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
            {error?.password && <p className="text-red-500 text-xs mt-1 dark:text-red-400">{error.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full p-2 rounded text-white font-bold transition shadow-md
                       bg-green-600 hover:bg-green-700 
                       dark:bg-green-600 dark:hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;