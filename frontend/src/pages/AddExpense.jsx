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

  return (
    <AppLayout title="Add Expense">
      <div className="max-w-2xl mx-auto perspective-1000">

        {/* Page header */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">New Expense Claim</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            Fill in the details below to submit a reimbursement request.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] transform hover:-translate-y-2 transition-all duration-500 ease-out">

          {error && (
            <div className="flex items-start gap-4 p-5 rounded-2xl mb-8 text-sm font-medium
              bg-red-50/80 text-red-700 border border-red-100 shadow-md backdrop-blur-sm
              dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-[fade-in_0.3s_ease-out]">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Description */}
            <div className="relative group">
              <input
                type="text" id="title" name="title" value={formData.title} onChange={handleChange} required placeholder=" "
                className="peer w-full px-5 pt-7 pb-3 text-base font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
              />
              <label 
                htmlFor="title" 
                className="absolute left-5 top-5 text-slate-500 dark:text-slate-400 text-base font-medium transition-all duration-300 pointer-events-none 
                peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
              >
                Description <span className="text-red-400">*</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Amount */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 dark:text-slate-500 text-lg font-bold pointer-events-none group-focus-within:text-indigo-500 transition-colors z-10">
                  $
                </span>
                <input
                  type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" placeholder=" "
                  className="peer w-full pl-10 pr-5 pt-7 pb-3 text-base font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]"
                />
                <label 
                  htmlFor="amount" 
                  className="absolute left-10 top-5 text-slate-500 dark:text-slate-400 text-base font-medium transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400
                  peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-indigo-600 dark:peer-[:not(:placeholder-shown)]:text-indigo-400"
                >
                  Amount <span className="text-red-400">*</span>
                </label>
              </div>

              {/* Category */}
              <div className="relative group">
                <select
                  id="category" name="category" value={formData.category} onChange={handleChange} required
                  className="peer w-full px-5 pt-6 pb-4 text-base font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)] appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-400">Select category…</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label 
                  htmlFor="category" 
                  className="absolute left-5 top-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all duration-300 pointer-events-none uppercase tracking-wider"
                >
                  Category <span className="text-red-400">*</span>
                </label>
              </div>
            </div>

            {/* Receipt upload */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">
                Receipt Attachment
              </label>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer
                border-indigo-300/50 bg-indigo-50/50 hover:bg-indigo-100/50 dark:border-indigo-700/50 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/30
                transition-all duration-300 group shadow-inner">
                <div className="text-center transition-transform duration-300 group-hover:-translate-y-1">
                  {receipt ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-3 shadow-md">
                        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{receipt.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Click to replace file</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-colors">
                        <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, PNG, JPG up to 10MB</p>
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
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 px-6 rounded-2xl text-base font-bold text-white tracking-wide uppercase
                  bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[length:200%_auto] hover:bg-[position:right_center]
                  focus:outline-none focus:ring-4 focus:ring-indigo-500/30
                  shadow-[0_15px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.7)]
                  transform hover:-translate-y-1.5 active:translate-y-0.5
                  transition-all duration-300 ease-out relative overflow-hidden group disabled:opacity-60 disabled:pointer-events-none"
              >
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                {loading ? (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    Submit claim
                    <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/my-expenses')}
                className="px-6 py-4 rounded-2xl text-base font-bold tracking-wide uppercase transition-all duration-300
                  bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700
                  hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600
                  shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0"
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
