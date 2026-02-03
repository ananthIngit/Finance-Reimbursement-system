import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '', // This will store the Category ID
  });
  const [receipt, setReceipt] = useState(null); // Separate state for file
  const [categories, setCategories] = useState([]); // For the dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Categories on Load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories/');
        setCategories(response.data);
      } catch (err) {
        console.error("Could not load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Handle Text Inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle File Input
  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  // 4. Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // PREPARE DATA FOR UPLOAD (Required for Files)
      const data = new FormData();
      data.append('title', formData.title);
      data.append('amount', formData.amount);
      data.append('category', formData.category);
      if (receipt) {
        data.append('receipt', receipt);
      }

      // SEND TO BACKEND
      // We POST to the same URL we used to GET the list
      await api.post('expenses/my/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Expense Submitted Successfully!');
      navigate('/my-expenses'); // Go back to the list

    } catch (err) {
      console.error("Upload failed", err);
      // Show backend error if available
      if (err.response && err.response.data) {
         setError(JSON.stringify(err.response.data));
      } else {
         setError('Failed to submit expense. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">New Expense Claim</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title / Description</label>
            <input 
              type="text" name="title" required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Flight to NYC"
              onChange={handleChange}
            />
          </div>

          {/* AMOUNT */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Amount ($)</label>
            <input 
              type="number" name="amount" required min="0" step="0.01"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select 
              name="category" required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* RECEIPT UPLOAD */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Receipt (Optional)</label>
            <input 
              type="file" 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate('/my-expenses')}
              className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;