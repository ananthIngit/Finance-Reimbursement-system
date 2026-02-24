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
      data.append('title', formData.title); // Note: Backend expects 'description' usually, but you mapped it to title here. 
      // Ensure backend serializer matches. Based on previous code, backend uses 'description'.
      // If your backend serializer field is 'description', change this key to 'description'.
      // Assuming you updated the serializer or this frontend key to match.
      // Let's use 'description' to match the standard Expense model if needed, 
      // but if your previous code worked with 'title', keep it. 
      // I will keep 'description' as per standard Expense model we built.
      data.append('description', formData.title); 
      
      data.append('amount', formData.amount);
      data.append('category', formData.category);
      if (receipt) {
        data.append('receipt', receipt);
      }

      // SEND TO BACKEND
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
          // If it's an object, try to format it nicely
          const msg = typeof err.response.data === 'object' 
            ? Object.values(err.response.data).flat().join(', ')
            : JSON.stringify(err.response.data);
          setError(msg);
      } else {
          setError('Failed to submit expense. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main Container
    <div className="min-h-screen flex justify-center items-center p-6 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      
      {/* Form Card */}
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 transition-colors duration-300 bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">New Expense Claim</h2>
        
        {error && (
            <div className="p-3 rounded mb-4 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">Title / Description</label>
            <input 
              type="text" name="title" required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                         bg-white border-gray-300 text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="e.g. Flight to NYC"
              onChange={handleChange}
            />
          </div>

          {/* AMOUNT */}
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">Amount ($)</label>
            <input 
              type="number" name="amount" required min="0" step="0.01"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                         bg-white border-gray-300 text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="0.00"
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
            <select 
              name="category" required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                         bg-white border-gray-300 text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled className="dark:bg-gray-700">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="dark:bg-gray-700">{cat.name}</option>
              ))}
            </select>
          </div>

          {/* RECEIPT UPLOAD */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">Receipt (Optional)</label>
            <input 
              type="file" 
              className="w-full text-sm 
                         text-gray-500 dark:text-gray-400
                         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                         dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:hover:file:bg-blue-900/50"
              onChange={handleFileChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate('/my-expenses')}
              className="w-1/2 py-2 rounded transition font-medium
                         bg-gray-300 text-gray-800 hover:bg-gray-400
                         dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-1/2 py-2 rounded transition font-medium text-white shadow-md
                         bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                         dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-900"
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