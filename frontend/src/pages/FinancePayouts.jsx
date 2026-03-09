import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'; 
import FilterPanel from '../components/FilterPanel'; // 👈 IMPORTED FILTER PANEL

const FinancePayouts = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination & Sorting States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('-created_at'); 

  // 👇 FILTER STATE (Defaults to Approved for Finance Queue)
  const [filters, setFilters] = useState({
      status: 'Approved', 
      category: '',
      startDate: '',
      endDate: ''
  });

  // Fetch Categories once on mount for the dropdown
  useEffect(() => {
    api.get('categories/')
       .then(res => setCategories(res.data))
       .catch(console.error);
  }, []);

  // 1. Fetch Expenses (Now sends pagination, sorting & filters to Backend)
  const fetchPayoutQueue = async () => {
    setLoading(true);
    try {
      let apiParams = {
          page: currentPage,
          page_size: pageSize,
          ordering: sortBy,
          status: filters.status || undefined,
          category: filters.category || undefined,
          // Django expects precise timestamps for gte/lte dates
          created_at__gte: filters.startDate ? `${filters.startDate}T00:00:00` : undefined,
          created_at__lte: filters.endDate ? `${filters.endDate}T23:59:59` : undefined,
      };

      const response = await api.get('expenses/finance/queue/', { params: apiParams });
      
      setExpenses(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));

    } catch (error) {
      console.error("Error fetching payout queue:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-run whenever page, size, or sorting changes
  useEffect(() => {
    fetchPayoutQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortBy]);

  // Action Handlers for the Filter Panel
  const handleApplyFilters = () => {
      if (currentPage !== 1) {
          setCurrentPage(1); // Resetting page triggers the fetch automatically
      } else {
          fetchPayoutQueue();
      }
  };

  const handleClearFilters = () => {
      // Clear filters but keep status empty so they can see all history
      setFilters({ status: '', category: '', startDate: '', endDate: '' });
      if (currentPage !== 1) {
          setCurrentPage(1);
      } else {
          setTimeout(() => fetchPayoutQueue(), 50); 
      }
  };

  // 2. Handle Reimbursement
  const handleReimburse = async (id) => {
    if (!window.confirm("Mark this expense as Reimbursed? This confirms payment has been sent.")) {
      return;
    }

    try {
      await api.post(`expenses/approve/${id}/`, {
        action: 'Reimbursed'
      });
      
      alert("Payment Recorded Successfully! 💸");
      fetchPayoutQueue(); // Refresh list
      
    } catch (error) {
      console.error("Payment failed", error);
      alert(error.response?.data?.error || "Could not process payment.");
    }
  };

  // Helper for status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'Reimbursed': return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'; // Pending
    }
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="flex justify-between items-start md:items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/finance-dashboard')}
            className="font-medium text-sm mb-2 flex items-center gap-1 transition-colors
                       text-gray-500 hover:text-gray-900 
                       dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Finance Portal
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Finance Queue</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review approved expenses and release payments.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-colors"
            >
                <option value="-created_at">Sort: Date (Newest)</option>
                <option value="amount">Sort: Amount (Low to High)</option>
                <option value="-amount">Sort: Amount (High to Low)</option>
                <option value="employee__id">Sort: Emp ID (Ascending)</option>
                <option value="-employee__id">Sort: Emp ID (Descending)</option>
            </select>
            <ThemeToggle />
        </div>
      </div>

      {/* 👇 INTEGRATED FILTER PANEL 👇 */}
      <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          categories={categories}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
      />

      {/* Content */}
      <div className="rounded-lg shadow-sm flex flex-col overflow-hidden border transition-colors duration-300 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        {loading ? (
          <div className="p-10 text-center">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-2 border-indigo-600 dark:border-indigo-400"></div>
             <p className="text-gray-500 dark:text-gray-400">Loading payment queue...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">No expenses found matching these filters. ☕</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-indigo-50 dark:bg-indigo-900/10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Beneficiary</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Expense Details</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                        <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {expenses.map((expense) => (
                        <tr key={expense.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{expense.employee_name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {expense.employee}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{expense.description || "No description"}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-900/30 dark:text-indigo-400">{expense.category_name}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Submitted: {new Date(expense.created_at).toLocaleDateString()}
                            </div>
                            {expense.receipt && (
                                <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="text-xs font-medium inline-block mt-2 text-blue-600 hover:underline dark:text-blue-400">
                                    📄 View Receipt
                                </a>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full border ${getStatusColor(expense.status)}`}>
                            {expense.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 dark:text-gray-100">
                            ${parseFloat(expense.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            {expense.status === 'Approved' ? (
                                <button 
                                onClick={() => handleReimburse(expense.id)}
                                className="px-4 py-2 rounded shadow text-sm font-bold transition
                                            bg-indigo-600 text-white hover:bg-indigo-700 
                                            dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                >
                                💸 Pay Now
                                </button>
                            ) : (
                                <span className="text-gray-400 text-xs italic dark:text-gray-500">Processed</span>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 👇 PAGINATION & PAGE SIZE CONTROLS 👇 */}
            <div className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-4 transition-colors border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 mt-auto">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages || 1}</span>
                </span>
                
                <div className="flex items-center gap-6">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Show:</span>
                        <div className="flex rounded shadow-sm overflow-hidden border border-gray-300 dark:border-gray-600">
                            {[10, 20, 30].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setPageSize(size)}
                                    className={`px-3 py-1 text-xs font-bold transition-colors border-r last:border-r-0 border-gray-300 dark:border-gray-600
                                        ${pageSize === size 
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                            : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Next/Prev Buttons */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => p - 1)} 
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border text-sm font-medium transition-colors
                                ${currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                        >
                            Previous
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => p + 1)} 
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-3 py-1 rounded border text-sm font-medium transition-colors
                                ${currentPage === totalPages || totalPages === 0
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePayouts;