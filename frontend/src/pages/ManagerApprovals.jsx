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
  // Default to 'pending' if no tab is specified
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
      // Show Approved AND Reimbursed (since Reimbursed is technically approved)
      return e.status === 'Approved' || e.status === 'Reimbursed';
    }
    if (mode === 'rejected') {
      return e.status === 'Rejected';
    }
    // 'history' mode: Show everything that is NOT pending
    return e.status !== 'Pending'; 
  });

  // 5. Dynamic Title
  const getPageTitle = () => {
    if (mode === 'pending') return 'Pending Approvals';
    if (mode === 'approved') return 'Approved Expenses';
    if (mode === 'rejected') return 'Rejected Expenses';
    return 'Full Approval History';
  };

  // Helper for status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Reimbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/manager-dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm mb-1 block"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {filteredExpenses.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-500 text-lg">No expenses found.</p>
                {mode === 'pending' && <p className="text-gray-400">All caught up! 🎉</p>}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={mode === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    
                    {/* Columns change based on Mode */}
                    {mode === 'pending' ? (
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{expense.employee_name}</div>
                        <div className="text-xs text-gray-500">{new Date(expense.date_incurred).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{expense.title}</div>
                        <div className="text-xs text-gray-500">{expense.category_name}</div>
                        {expense.receipt && (
                          <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block mt-1">View Receipt</a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${expense.amount}</td>

                      {/* RENDER ACTIONS OR STATUS BADGE */}
                      {mode === 'pending' ? (
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleAction(expense.id, 'Approved')} 
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 mr-2 text-xs font-bold shadow-sm transition"
                          >
                            ✔ Approve
                          </button>
                          <button 
                            onClick={() => handleAction(expense.id, 'Rejected')} 
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 text-xs font-bold shadow-sm transition"
                          >
                            ✖ Reject
                          </button>
                        </td>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 italic">
                             {expense.remarks || "-"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerApprovals;