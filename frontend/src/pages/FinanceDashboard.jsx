import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    pending_payment: 0, 
    total_paid: 0,      
    total_payout: 0     
  });
  const [userProfile, setUserProfile] = useState(null); // 👈 For Navbar profile
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Finance Stats
        const statsRes = await api.get('dashboard/finance/');
        setStats(statsRes.data);

        // Fetch Profile for the Navbar
        const profileRes = await api.get('users/profile/');
        setUserProfile(profileRes.data);
      } catch (error) {
        console.error("Failed to fetch finance data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const response = await api.get('expenses/export/', { responseType: 'blob' });
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
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans pb-12 transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      
      {/* Navbar */}
      <nav className="shadow-sm border-b sticky top-0 z-10 transition-colors duration-300 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* 👇 NEW PROFILE BUTTON (LEFT SIDE) 👇 */}
            <div 
              onClick={() => navigate('/finance/profile')} 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group"
              title="View Finance Profile"
            >
              <div className="relative">
                {userProfile?.profile_picture ? (
                  <img 
                    src={userProfile.profile_picture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 group-hover:border-emerald-400 dark:border-emerald-900"
                  />
                ) : (
                  <div className="bg-emerald-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-transparent">
                    {userProfile?.username?.charAt(0).toUpperCase() || "F"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 bg-green-400 ring-white dark:ring-slate-800"></span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold leading-tight text-slate-800 dark:text-white">
                  {userProfile?.username || "Finance Admin"}
                </h1>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">View Profile</span>
              </div>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                  ${downloading 
                    ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/40'
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

              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200
                           text-slate-600 hover:text-red-600 
                           dark:text-slate-300 dark:hover:text-red-400"
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Financial Overview</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Manage company payouts and track reimbursements.</p>
          </div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            Report Date: <span className="text-slate-600 dark:text-slate-300">{new Date().toLocaleDateString()}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/finance/payouts')}
            className="col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group
                       dark:from-indigo-700 dark:to-indigo-800"
          >
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

          <div className="rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border-emerald-100 dark:bg-slate-800 dark:border-emerald-900/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-emerald-600 dark:text-emerald-400">Total Disbursed</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">${stats.total_payout}</h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs mt-2 font-medium text-emerald-600 dark:text-emerald-400">100% successful payouts</p>
            </div>
          </div>

          <div className="rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Total Transactions</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total_paid}</h3>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <svg className="w-6 h-6 text-slate-400 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs mt-2 text-slate-400 dark:text-slate-500">Lifetime processed claims</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4 flex items-start gap-3 text-sm transition-colors bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Use the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Action Required</span> card to navigate to the Payouts Queue. There you can approve funds for individual employees.
          </p>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;