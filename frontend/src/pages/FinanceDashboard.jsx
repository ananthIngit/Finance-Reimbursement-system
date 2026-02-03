import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    pending_payment: 0, // Count of 'Approved' status
    total_paid: 0,      // Count of 'Reimbursed' status
    total_payout: 0     // Sum of Reimbursed amount
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false); // <--- State for export button
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('dashboard/finance/');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch finance stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // 👇 NEW: Handle Excel Download
  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      
      // Request the file from the backend as a Blob
      const response = await api.get('expenses/export/', {
        responseType: 'blob', 
      });

      // Create a hidden link to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to download the report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Navbar / Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Finance Portal</h1>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-3">
              
              {/* 👇 DOWNLOAD BUTTON 👇 */}
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                  ${downloading 
                    ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                  }`}
              >
                {downloading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Report</span>
                  </>
                )}
              </button>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors duration-200"
              >
                <span>Sign Out</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900">Financial Overview</h2>
            <p className="text-slate-500 text-lg">Manage company payouts and track reimbursements.</p>
          </div>
          <p className="text-sm font-medium text-slate-400">
            Report Date: <span className="text-slate-600">{new Date().toLocaleDateString()}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Ready to Pay (Actionable) */}
          <div
            onClick={() => navigate('/finance/payouts')}
            className="col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
          >
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-indigo-100 font-medium uppercase tracking-wider text-sm">Action Required</p>
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{stats.pending_payment} Pending</span>
                </div>
                <h3 className="text-4xl font-bold">{stats.pending_payment}</h3>
                <p className="text-indigo-200 text-sm mt-1">Claims waiting for disbursement</p>
              </div>

              <div className="mt-6 flex items-center gap-2 font-semibold">
                <span>Process Payments</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Total Disbursed */}
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Disbursed</p>
                <h3 className="text-3xl font-bold text-slate-800">${stats.total_payout}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              {/* Tiny graph placeholder or descriptive text */}
              <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-emerald-600 text-xs mt-2 font-medium">100% successful payouts</p>
            </div>
          </div>

          {/* Card 3: Completed Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Transactions</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.total_paid}</h3>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-xs mt-2">Lifetime processed claims</p>
            </div>
          </div>

        </div>

        {/* Quick Help / Info Section */}
        <div className="bg-slate-100 rounded-lg p-4 flex items-start gap-3 text-slate-600 text-sm">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Use the <span className="font-semibold text-indigo-600">Action Required</span> card to navigate to the Payouts Queue. There you can approve funds for individual employees.
          </p>
        </div>

      </main>
    </div>
  );
};

export default FinanceDashboard;