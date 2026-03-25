import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import AppLayout from '../components/layout/AppLayout';
import FilterPanel from '../components/FilterPanel';

const statusBadge = (status) => {
  const map = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 shadow-[0_4px_10px_rgba(16,185,129,0.1)]',
    Rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 shadow-[0_4px_10px_rgba(239,68,68,0.1)]',
    Reimbursed: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800 shadow-[0_4px_10px_rgba(99,102,241,0.1)]',
  };
  return map[status] || 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 shadow-[0_4px_10px_rgba(245,158,11,0.1)]';
};

const FinancePayouts = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('-created_at');

  const [filters, setFilters] = useState({
    status: 'Approved',
    category: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    api.get('categories/').then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  const fetchPayoutQueue = async () => {
    setLoading(true);
    try {
      const response = await api.get('expenses/finance/queue/', {
        params: {
          page: currentPage,
          page_size: pageSize,
          ordering: sortBy,
          status: filters.status || undefined,
          category: filters.category || undefined,
          created_at__gte: filters.startDate ? `${filters.startDate}T00:00:00` : undefined,
          created_at__lte: filters.endDate ? `${filters.endDate}T23:59:59` : undefined,
        },
      });
      setExpenses(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error('Error fetching payout queue:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPayoutQueue(); }, [currentPage, pageSize, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [pageSize]);

  const handleApplyFilters = () => {
    if (currentPage !== 1) setCurrentPage(1);
    else fetchPayoutQueue();
  };

  const handleClearFilters = () => {
    setFilters({ status: '', category: '', startDate: '', endDate: '' });
    if (currentPage !== 1) setCurrentPage(1);
    else setTimeout(() => fetchPayoutQueue(), 50);
  };

  const handleReimburse = async (id) => {
    if (!window.confirm('Mark this expense as Reimbursed? This confirms payment has been sent.')) return;
    try {
      await api.post(`expenses/approve/${id}/`, { action: 'Reimbursed' });
      alert('Payment recorded successfully!');
      fetchPayoutQueue();
    } catch (error) {
      console.error('Payment failed', error);
      alert(error.response?.data?.error || 'Could not process payment.');
    }
  };

  const handleDownloadReport = async () => {
    setExporting(true);
    try {
      const response = await api.get('expenses/export/', {
        responseType: 'blob',
        params: { status: filters.status || undefined }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate Excel report.");
    } finally {
      setExporting(false);
    }
  };

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      {/* Download Button */}
      <button
        onClick={handleDownloadReport}
        disabled={exporting}
        className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm border-2 backdrop-blur-md relative overflow-hidden group
          bg-white/70 border-slate-200/50 text-slate-700 hover:bg-white hover:border-indigo-300 hover:text-indigo-600
          dark:bg-slate-900/70 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >
        {!exporting && (
          <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        )}
        {exporting ? (
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin relative z-10" />
        ) : (
          <svg className="w-4 h-4 text-indigo-500 relative z-10 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}
        <span className="relative z-10">{exporting ? 'Generating...' : 'Export Excel'}</span>
      </button>

      <div className="relative group/select">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border-2 transition-all duration-300
            bg-white/70 border-slate-200/50 text-slate-700 hover:border-indigo-300 hover:bg-white
            dark:bg-slate-900/70 dark:border-slate-700/50 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800
            focus:outline-none focus:ring-4 focus:ring-indigo-500/20 cursor-pointer appearance-none shadow-sm backdrop-blur-md pr-9 relative z-10"
        >
          <option value="-created_at">Newest first</option>
          <option value="amount">Amount ↑</option>
          <option value="-amount">Amount ↓</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-indigo-500 transition-colors z-20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout title="Finance Queue" actions={headerActions}>
      <div className="space-y-6 max-w-7xl mx-auto perspective-1000">

        {/* Page header */}
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Finance Queue</h2>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">
            Review approved company expenses and release payments to employees in real-time.
          </p>
        </div>

        {/* Filter panel */}
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        {/* Table container */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 mt-6 relative z-10">
          {loading ? (
            <div className="p-16 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide">Loading payment queue…</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Queue is empty</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">No expenses found for the selected filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-md">
                    <tr>
                      {['Beneficiary', 'Expense Details', 'Status', 'Amount', 'Action'].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-transparent">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shadow-inner">
                              {expense.employee_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{expense.employee_name}</p>
                              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 tracking-wider uppercase">
                                ID: {expense.employee}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 max-w-[220px]">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {expense.description || 'No description'}
                          </p>
                          <span className="inline-block mt-1.5 text-[10px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                            {expense.category_name}
                          </span>
                          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wider">
                            {new Date(expense.created_at).toLocaleDateString()}
                          </p>
                          {expense.receipt && (
                            <a href={expense.receipt} target="_blank" rel="noopener noreferrer"
                              className="block text-xs font-bold mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                              View receipt →
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${statusBadge(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-lg font-extrabold text-slate-900 dark:text-white">
                          ${parseFloat(expense.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {expense.status === 'Approved' ? (
                            <button
                              onClick={() => handleReimburse(expense.id)}
                              className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden
                                bg-indigo-600 text-white shadow-[0_5px_15px_-3px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_20px_-3px_rgba(79,70,229,0.6)]
                                hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover/btn:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                              <svg className="w-4 h-4 relative z-10 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="relative z-10">Pay Now</span>
                            </button>
                          ) : (
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Processed
                            </span>
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

export default FinancePayouts;