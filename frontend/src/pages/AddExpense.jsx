import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', amount: '', category: '' });
  const [receipt, setReceipt] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories/');
        setCategories(response.data);
      } catch (err) {
        console.error('Could not load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('description', formData.title);
      data.append('amount', formData.amount);
      data.append('category', formData.category);
      if (receipt) data.append('receipt', receipt);

      await api.post('expenses/my/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Expense submitted successfully!');
      navigate('/my-expenses');
    } catch (err) {
      console.error('Upload failed', err);
      const msg =
        err.response?.data
          ? typeof err.response.data === 'object'
            ? Object.values(err.response.data).flat().join(', ')
            : JSON.stringify(err.response.data)
          : 'Failed to submit expense. Please check your inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-200 ' +
    'bg-white border-slate-300 text-slate-900 placeholder-slate-400 ' +
    'dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <AppLayout title="Add Expense">
      <div className="max-w-xl mx-auto">

        {/* Page header */}
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Expense Claim</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Fill in the details below to submit a reimbursement request.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm">

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5 text-sm animate-fade-in
              bg-red-50 text-red-700 border border-red-100
              dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Client lunch, Travel to conference"
                className={inputCls}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Amount ($) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 text-sm font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className={inputCls + ' pl-8'}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">Select a category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Receipt upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Receipt <span className="text-slate-400 font-normal"></span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer
                border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800
                transition-colors group">
                <div className="text-center">
                  {receipt ? (
                    <>
                      <svg className="w-6 h-6 mx-auto mb-1.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{receipt.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mx-auto mb-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  name="receipt"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
                  bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                  transition-all duration-200 shadow-sm hover:shadow-md
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : 'Submit claim'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-expenses')}
                className="px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors
                  bg-white text-slate-600 border-slate-300 hover:bg-slate-50
                  dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddExpense;
