import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        <form onSubmit={handleRegister}>
          {/* USERNAME */}
          <div className="mb-3">
            <input 
              type="text" name="username" placeholder="Username"
              className="w-full p-2 border rounded"
              onChange={handleChange} required
            />
            {error?.username && <p className="text-red-500 text-xs">{error.username}</p>}
          </div>

          {/* NAME FIELDS */}
          <div className="flex gap-2 mb-3">
            <input 
              type="text" name="first_name" placeholder="First Name"
              className="w-full p-2 border rounded"
              onChange={handleChange} required
            />
            <input 
              type="text" name="last_name" placeholder="Last Name"
              className="w-full p-2 border rounded"
              onChange={handleChange} required
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <input 
              type="email" name="email" placeholder="Email"
              className="w-full p-2 border rounded"
              onChange={handleChange} required
            />
            {error?.email && <p className="text-red-500 text-xs">{error.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <input 
              type="password" name="password" placeholder="Password"
              className="w-full p-2 border rounded"
              onChange={handleChange} required
            />
            {error?.password && <p className="text-red-500 text-xs">{error.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;