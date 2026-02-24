import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';

const ManagerApprovals = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Determine "Mode" based on URL
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const mode = tabParam || 'pending'; 

  // 2. Fetch Team Expenses
  const fetchTeamExpenses = async () => {
    try {
      const response = await api.get('expenses/team/');
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching team expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamExpenses();
  }, []);

  // 3. Handle Action (Approve/Reject)
  const handleAction = async (id, action) => {
    let remarks = '';
    if (action === 'Rejected') {
      remarks = prompt("Please enter a reason for rejection:");
      if (remarks === null) return; 
    }

    try {
      await api.post(`expenses/approve/${id}/`, {
        action: action, 
        remarks: remarks
      });
      alert(`Expense ${action} Successfully!`);
      fetchTeamExpenses();
    } catch (error) {
      console.error(`Failed to ${action} expense`, error);
      alert(error.response?.data?.error || "Something went wrong.");
    }
  };

  // 4. Filter Data based on the Mode
  const filteredExpenses = expenses.filter(e => {
    if (mode === 'pending') {
      return e.status === 'Pending';
    }
    if (mode === 'approved') {
      return e.status === 'Approved' || e.status === 'Reimbursed';
    }
    if (mode === 'rejected') {
      return e.status === 'Rejected';
    }
    return e.status !== 'Pending'; 
  });

  // 5. Dynamic Title
  const getPageTitle = () => {
    if (mode === 'pending') return 'Pending Approvals';
    if (mode === 'approved') return 'Approved Expenses';
    if (mode === 'rejected') return 'Rejected Expenses';
    return 'Full Approval History';
  };

  // Helper for status badge colors (Adapted for Dark Mode)
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Reimbursed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    // Main Container
    <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/manager-dashboard')}
            className="font-medium text-sm mb-1 block transition-colors
                       text-gray-600 hover:text-gray-900 
                       dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="rounded-lg shadow overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-800">
        {loading ? (
          <p className="p-10 text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <>
            {filteredExpenses.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">No expenses found.</p>
                {mode === 'pending' && <p className="text-gray-400 dark:text-gray-500">All caught up! 🎉</p>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={
                        mode === 'pending' 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    }>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                        
                        {/* Columns change based on Mode */}
                        {mode === 'pending' ? (
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                        ) : (
                        <>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Remarks</th>
                        </>
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.employee_name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(expense.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100">{expense.description}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{expense.category_name}</div>
                            {expense.receipt && (
                            <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="text-xs font-medium block mt-1 text-blue-600 hover:underline dark:text-blue-400">
                                View Receipt
                            </a>
                            )}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">${expense.amount}</td>

                        {/* RENDER ACTIONS OR STATUS BADGE */}
                        {mode === 'pending' ? (
                            <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                                <button 
                                    onClick={() => handleAction(expense.id, 'Approved')} 
                                    className="px-3 py-1 rounded-full text-xs font-bold shadow-sm transition
                                            bg-green-100 text-green-700 hover:bg-green-200 
                                            dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
                                >
                                    ✔ Approve
                                </button>
                                <button 
                                    onClick={() => handleAction(expense.id, 'Rejected')} 
                                    className="px-3 py-1 rounded-full text-xs font-bold shadow-sm transition
                                            bg-red-100 text-red-700 hover:bg-red-200 
                                            dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60"
                                >
                                    ✖ Reject
                                </button>
                            </div>
                            </td>
                        ) : (
                            <>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                                {expense.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm italic text-gray-500 dark:text-gray-400">
                                {expense.remarks || "-"}
                            </td>
                            </>
                        )}
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerApprovals;