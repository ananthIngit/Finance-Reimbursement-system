import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import AppLayout from '../components/layout/AppLayout';
import FilterPanel from '../components/FilterPanel';

const statusBadge = (status) => {
  const map = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900',
    Rejected: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900',
    Reimbursed: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900',
  };
  return map[status] || 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900';
};

const FinancePayouts = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false); // New state for download button

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

  // 📥 New Function: Handles the Excel download
  const handleDownloadReport = async () => {
    setExporting(true);
    try {
      const response = await api.get('expenses/export/', {
        responseType: 'blob',
        params: { status: filters.status || undefined } // Syncs report with current filter
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up memory
    } catch (err) {
      alert("Failed to generate Excel report.");
    } finally {
      setExporting(false);
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      {/* Download Button */}
      <button
        onClick={handleDownloadReport}
        disabled={exporting}
        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border
                    bg-white text-slate-700 border-slate-300 hover:bg-slate-50
                    dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition shadow-sm"
      >
        {exporting ? (
          <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}
        {exporting ? 'Generating...' : 'Export Excel'}
      </button>

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
    </div>
  );

  return (
    <AppLayout title="Finance Queue" actions={headerActions}>
      <div className="space-y-5 max-w-7xl">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Finance Queue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review approved expenses and release payments to employees.
          </p>
        </div>

        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600 dark:border-indigo-400 mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading payment queue…</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-base font-medium text-slate-600 dark:text-slate-300">Queue is empty</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">No expenses found for the selected filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {['Beneficiary', 'Expense Details', 'Status', 'Amount', 'Action'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{expense.employee_name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">ID: {expense.employee}</p>
                        </td>
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {expense.description || 'No description'}
                          </p>
                          <span className="inline-block mt-1 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                            {expense.category_name}
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {new Date(expense.created_at).toLocaleDateString()}
                          </p>
                          {expense.receipt && (
                            <a href={expense.receipt} target="_blank" rel="noopener noreferrer"
                              className="block text-xs font-medium mt-1.5 text-blue-600 dark:text-blue-400 hover:underline">
                              View receipt →
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                          ${parseFloat(expense.amount).toFixed(2)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {expense.status === 'Approved' ? (
                            <button
                              onClick={() => handleReimburse(expense.id)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                                                                bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-600 italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Logic... */}
              <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/30">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page <span className="font-semibold text-slate-800 dark:text-white">{currentPage}</span> of{' '}
                  <span className="font-semibold text-slate-800 dark:text-white">{totalPages || 1}</span>
                </span>
                <div className="flex items-center gap-4">
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
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                                                ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                                                ${(currentPage === totalPages || totalPages === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
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

export default FinancePayouts;