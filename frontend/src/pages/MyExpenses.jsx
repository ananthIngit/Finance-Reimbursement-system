import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const statusBadge = (status) => {
  const map = {
    Approved:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 shadow-[0_4px_10px_rgba(16,185,129,0.1)]',
    Rejected:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 shadow-[0_4px_10px_rgba(239,68,68,0.1)]',
    Reimbursed:  'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800 shadow-[0_4px_10px_rgba(99,102,241,0.1)]',
  };
  return map[status] || 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 shadow-[0_4px_10px_rgba(245,158,11,0.1)]';
};

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get('status');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('-created_at');

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await api.get('expenses/my/', {
          params: { status: currentFilter, page: currentPage, page_size: pageSize, ordering: sortBy },
        });
        setExpenses(response.data.results);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [currentFilter, currentPage, pageSize, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [currentFilter, pageSize, sortBy]);

  /* Header actions slot */
  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border-2 transition-all duration-300
            bg-white/50 border-slate-200 text-slate-700 hover:border-indigo-300
            dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500
            focus:outline-none focus:ring-4 focus:ring-indigo-500/20 cursor-pointer appearance-none shadow-sm backdrop-blur-sm pr-9"
        >
          <option value="-created_at">Newest first</option>
          <option value="amount">Amount ↑</option>
          <option value="-amount">Amount ↓</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {currentFilter && (
        <button
          onClick={() => setSearchParams({})}
          className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border-2 transition-all duration-300
            bg-white/50 text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
            dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600 backdrop-blur-sm
            active:scale-95"
        >
          Clear
        </button>
      )}
      
      <button
        onClick={() => navigate('/add-expense')}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl
          bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 
          shadow-[0_8px_15px_-3px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_20px_-3px_rgba(99,102,241,0.6)]
          transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Expense
      </button>
    </div>
  );

  return (
    <AppLayout title="History" actions={headerActions}>
      <div className="space-y-6 max-w-7xl mx-auto perspective-1000">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">My Expenses</h2>
          {currentFilter && (
            <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase border-2 ${statusBadge(currentFilter)}`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse opacity-70"></span>
              {currentFilter} filtered
            </span>
          )}
        </div>

        {/* ── Table Container ── */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500">
          {loading ? (
            <div className="p-16 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide">Loading your history…</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No expenses found</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                {currentFilter ? 'No expenses match the current filter criteria.' : 'Time to create your first claim!'}
              </p>
              {currentFilter ? (
                <button 
                  onClick={() => setSearchParams({})} 
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/add-expense')} 
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1"
                >
                  Create Expense
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-md">
                    <tr>
                      {['Date', 'Category', 'Description', 'Amount', 'Status', 'Receipt'].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-transparent">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(expense.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {expense.category_name || expense.category}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                          {expense.description || 'No description'}
                        </td>
                        <td className="px-6 py-5 text-base font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          ${expense.amount}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${statusBadge(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          {expense.receipt ? (
                            <a href={expense.receipt} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-800 transition-colors group-hover:shadow-sm"
                              title="View Receipt"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-5 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                  Page <span className="font-bold text-slate-800 dark:text-white mx-1">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800 dark:text-white ml-1">{totalPages || 1}</span>
                </span>

                <div className="flex items-center gap-6">
                  {/* Page size */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rows:</span>
                    <div className="flex p-0.5 rounded-xl bg-slate-200/50 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700">
                      {[10, 20, 30].map((size) => (
                        <button
                          key={size}
                          onClick={() => setPageSize(size)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300
                            ${pageSize === size
                              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prev / Next */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
                        ${currentPage === 1
                          ? 'bg-slate-100/50 text-slate-400 border border-transparent cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:text-indigo-400 active:scale-95'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
                        ${currentPage === totalPages || totalPages === 0
                          ? 'bg-slate-100/50 text-slate-400 border border-transparent cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:text-indigo-400 active:scale-95'}`}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyExpenses;
