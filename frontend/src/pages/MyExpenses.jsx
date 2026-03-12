import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const statusBadge = (status) => {
  const map = {
    Approved:    'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900',
    Rejected:    'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900',
    Reimbursed:  'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900',
  };
  return map[status] || 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900';
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
    <div className="flex items-center gap-2.5">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="text-xs px-2.5 py-1.5 rounded-lg border
          bg-white border-slate-300 text-slate-700
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        <option value="-created_at">Newest first</option>
        <option value="amount">Amount ↑</option>
        <option value="-amount">Amount ↓</option>
      </select>
      {currentFilter && (
        <button
          onClick={() => setSearchParams({})}
          className="text-xs px-2.5 py-1.5 rounded-lg border transition
            bg-white text-slate-600 border-slate-300 hover:bg-slate-50
            dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
        >
          Clear filter
        </button>
      )}
      <button
        onClick={() => navigate('/add-expense')}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
          bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add expense
      </button>
    </div>
  );

  return (
    <AppLayout title="My Expenses" actions={headerActions}>
      <div className="space-y-5 max-w-7xl">

        {/* ── Page header ── */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Expenses</h2>
          {currentFilter && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(currentFilter)}`}>
              {currentFilter}
            </span>
          )}
        </div>

        {/* ── Table Container ── */}
        <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600 dark:border-indigo-400 mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading your history…</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-base font-medium text-slate-600 dark:text-slate-300">No expenses found</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {currentFilter ? (
                  <button onClick={() => setSearchParams({})} className="text-indigo-600 dark:text-indigo-400 hover:underline">View all history</button>
                ) : 'Time to create your first claim!'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {['Date', 'Category', 'Description', 'Amount', 'Status', 'Receipt'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(expense.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {expense.category_name || expense.category}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                          {expense.description || 'No description'}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          ${expense.amount}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {expense.receipt ? (
                            <a href={expense.receipt} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors">
                              View
                            </a>
                          ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/30">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page <span className="font-semibold text-slate-800 dark:text-white">{currentPage}</span> of{' '}
                  <span className="font-semibold text-slate-800 dark:text-white">{totalPages || 1}</span>
                </span>

                <div className="flex items-center gap-4">
                  {/* Page size */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Show:</span>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {[10, 20, 30].map((size) => (
                        <button
                          key={size}
                          onClick={() => setPageSize(size)}
                          className={`px-2.5 py-1 text-xs font-semibold border-r last:border-r-0 border-slate-200 dark:border-slate-700 transition-colors
                            ${pageSize === size
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prev / Next */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                        ${currentPage === 1
                          ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed dark:bg-slate-800 dark:text-slate-700 dark:border-slate-800'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                        ${currentPage === totalPages || totalPages === 0
                          ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed dark:bg-slate-800 dark:text-slate-700 dark:border-slate-800'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                    >
                      Next →
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
