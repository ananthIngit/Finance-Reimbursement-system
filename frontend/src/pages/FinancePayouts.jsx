import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const FinancePayouts = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Expenses Ready for Payment
  const fetchPayoutQueue = async () => {
    try {
      const response = await api.get('expenses/finance/queue/');
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching payout queue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutQueue();
  }, []);

  // 2. Handle Reimbursement
  const handleReimburse = async (id) => {
    // Confirm before paying
    if (!window.confirm("Mark this expense as Reimbursed? This confirms payment has been sent.")) {
      return;
    }

    try {
      // Re-using the same Approve/Reject endpoint, but with 'Reimbursed' action
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

  return (
    // Main Container
    <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/finance-dashboard')}
            className="font-medium text-sm mb-1 block transition-colors
                       text-gray-600 hover:text-gray-900 
                       dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Finance Portal
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payment Queue</h1>
          <p className="text-gray-500 dark:text-gray-400">Review approved expenses and release payments.</p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg shadow overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-800">
        {loading ? (
          <p className="p-10 text-center text-gray-500 dark:text-gray-400">Loading queue...</p>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">No pending payments. ☕</p>
            <p className="text-gray-400 dark:text-gray-500">All approved expenses have been reimbursed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-indigo-50 dark:bg-indigo-900/20">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Beneficiary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Expense Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Date Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {expenses.map((expense) => (
                    <tr key={expense.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{expense.employee_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {expense.employee}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{expense.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{expense.category_name}</div>
                        {expense.receipt && (
                            <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline text-blue-600 dark:text-blue-400">View Receipt</a>
                        )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(expense.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                        ${expense.amount}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                        onClick={() => handleReimburse(expense.id)}
                        className="px-4 py-2 rounded shadow text-sm font-medium transition
                                   bg-indigo-600 text-white hover:bg-indigo-700 
                                   dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        >
                        💸 Pay Now
                        </button>
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

export default FinancePayouts;