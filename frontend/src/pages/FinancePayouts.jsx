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
      // We will need to make sure this URL exists in urls.py
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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/finance-dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm mb-1 block"
          >
            ← Back to Finance Portal
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Payment Queue</h1>
          <p className="text-gray-500">Review approved expenses and release payments.</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-gray-500">Loading queue...</p>
        ) : expenses.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 text-lg">No pending payments. ☕</p>
            <p className="text-gray-400">All approved expenses have been reimbursed.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beneficiary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{expense.employee_name}</div>
                    <div className="text-xs text-gray-500">ID: {expense.employee}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{expense.title}</div>
                    <div className="text-xs text-gray-500">{expense.category_name}</div>
                    {expense.receipt && (
                       <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View Receipt</a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {/* Shows when it was created (or you could show updated_at if you have it) */}
                    {new Date(expense.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ${expense.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleReimburse(expense.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 text-sm font-medium transition"
                    >
                      💸 Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FinancePayouts;