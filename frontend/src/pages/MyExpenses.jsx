import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the 'status' from the URL (e.g., ?status=Pending)
  const currentFilter = searchParams.get('status');

  // 1. Fetch Data (Re-runs when filter changes)
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await api.get('expenses/my/', {
            params: {
                status: currentFilter // If null, it fetches all
            }
        });
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [currentFilter]);

  // Helper function for status colors (Adapted for Dark Mode)
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'Reimbursed': return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'; // Pending
    }
  };

  return (
    // Main Container
    <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      
      {/* Header with Back Button AND Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="font-medium text-sm mb-2 flex items-center gap-1 transition-colors
                       text-gray-500 hover:text-gray-900 
                       dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                My Expenses
            </h1>
            
            {/* Show Badge if Filter is Active */}
            {currentFilter && (
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(currentFilter)}`}>
                    Showing: {currentFilter}
                </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
            {/* Clear Filter Button */}
            {currentFilter && (
                <button 
                    onClick={() => setSearchParams({})} 
                    className="px-4 py-2 rounded transition shadow-sm text-sm font-medium border
                               bg-white text-gray-600 border-gray-300 hover:bg-gray-50
                               dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                    Show All
                </button>
            )}

            {/* Add Expense Button */}
            <button 
                onClick={() => navigate('/add-expense')}
                className="px-5 py-2 rounded transition shadow flex items-center gap-2 font-medium text-white
                           bg-indigo-600 hover:bg-indigo-700 
                           dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
                <span>+</span> Add Expense
            </button>
        </div>
      </div>

      {/* The Table Container */}
      <div className="rounded-lg shadow-sm overflow-hidden border transition-colors duration-300
                      bg-white border-gray-200 
                      dark:bg-gray-800 dark:border-gray-700">
        
        {loading ? (
          <div className="p-10 text-center">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-2 border-indigo-600 dark:border-indigo-400"></div>
             <p className="text-gray-500 dark:text-gray-400">Loading your history...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center">
              <p className="text-gray-500 text-lg dark:text-gray-400">No expenses found matching this criteria.</p>
              {currentFilter ? (
                  <button 
                    onClick={() => setSearchParams({})}
                    className="mt-2 hover:underline text-indigo-600 dark:text-indigo-400"
                  >
                      View all history
                  </button>
              ) : (
                  <p className="text-gray-400 dark:text-gray-500">Time to create your first claim!</p>
              )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                    {['Date', 'Category', 'Title', 'Amount', 'Status', 'Receipt'].map((head) => (
                        <th key={head} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {head}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {expenses.map((expense) => (
                    <tr key={expense.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(expense.created_at).toLocaleDateString()}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        {expense.category_name || expense.category} 
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {expense.description ? (
                             expense.description.length > 30 
                                ? expense.description.substring(0, 30) + '...' 
                                : expense.description
                        ) : 'No description'}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                        ${expense.amount}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(expense.status)}`}>
                        {expense.status}
                        </span>
                    </td>

                    {/* Receipt Link */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {expense.receipt ? (
                        <a 
                            href={expense.receipt} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium hover:underline text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            View Receipt
                        </a>
                        ) : (
                        <span className="text-gray-400 text-xs italic dark:text-gray-500">No Receipt</span>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExpenses;