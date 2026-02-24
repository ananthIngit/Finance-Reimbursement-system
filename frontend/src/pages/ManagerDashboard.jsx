import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    pending_approvals: 0,
    total_approved: 0,
    total_rejected: 0,
    department_spend: 0
  });
  const [userProfile, setUserProfile] = useState(null); // 👈 For Navbar profile
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stats
        const statsRes = await api.get('dashboard/manager/');
        setStats(statsRes.data);

        // Fetch Profile for the Navbar
        const profileRes = await api.get('users/profile/');
        setUserProfile(profileRes.data);
      } catch (error) {
        console.error("Failed to fetch manager data", error);
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
              onClick={() => navigate('/manager/profile')} 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group"
              title="View Manager Profile"
            >
              <div className="relative">
                {userProfile?.profile_picture ? (
                  <img 
                    src={userProfile.profile_picture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-400 dark:border-indigo-900"
                  />
                ) : (
                  <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-transparent">
                    {userProfile?.username?.charAt(0).toUpperCase() || "M"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 bg-green-400 ring-white dark:ring-slate-800"></span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold leading-tight text-slate-800 dark:text-white">
                  {userProfile?.username || "Manager"}
                </h1>
                <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400">Manager Account</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
                <ThemeToggle />

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
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
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Team Overview</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Detailed insights into your team's spending and approvals.</p>
          </div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            Department: <span className="text-slate-600 dark:text-slate-300">{userProfile?.department_name || "Engineering"}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Pending */}
          <div
            onClick={() => navigate('/manager/approvals?tab=pending')}
            className="col-span-1 md:col-span-2 lg:col-span-1 rounded-xl shadow-lg p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700"
          >
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-amber-100 font-medium uppercase tracking-wider text-xs mb-1">Attention Needed</p>
                <h3 className="text-4xl font-bold">{stats.pending_approvals || 0}</h3>
                <p className="text-amber-100 text-sm mt-1">Pending Requests</p>
              </div>
              <div className="mt-4 flex items-center gap-2 font-semibold text-sm">
                <span>Review Queue</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Approved */}
          <div
            onClick={() => navigate('/manager/approvals?tab=approved')}
            className="rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group bg-white border-emerald-100 dark:bg-slate-800 dark:border-emerald-900/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-emerald-600 dark:text-emerald-400">Approved</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total_approved || 0}</h3>
              </div>
              <div className="p-3 rounded-lg transition-colors bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-900/20 dark:group-hover:bg-emerald-900/40">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs mt-4 transition-colors text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400">View details &rarr;</p>
          </div>

          {/* Card 3: Rejected */}
          <div
            onClick={() => navigate('/manager/approvals?tab=rejected')}
            className="rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group bg-white border-rose-100 dark:bg-slate-800 dark:border-rose-900/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-rose-600 dark:text-rose-400">Rejected</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total_rejected || 0}</h3>
              </div>
              <div className="p-3 rounded-lg transition-colors bg-rose-50 group-hover:bg-rose-100 dark:bg-rose-900/20 dark:group-hover:bg-rose-900/40">
                <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs mt-4 transition-colors text-slate-400 group-hover:text-rose-600 dark:text-slate-500 dark:group-hover:text-rose-400">View details &rarr;</p>
          </div>

          {/* Card 4: Dept Spending */}
          <div className="rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-shadow bg-white border-blue-100 dark:bg-slate-800 dark:border-blue-900/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-blue-600 dark:text-blue-400">Dept. Spend</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">${stats.department_spend || 0}</h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs mt-4 text-slate-400 dark:text-slate-500">Total budget used</p>
          </div>
        </div>

        {/* Feature Section: History */}
        <div className="rounded-xl shadow-sm border p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full hidden md:block bg-slate-100 dark:bg-slate-700">
              <svg className="w-6 h-6 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Approval History</h3>
              <p className="mt-1 max-w-2xl text-slate-500 dark:text-slate-400">
                Access a complete audit log of all expenses that have been processed by your team.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/manager/approvals?tab=history')}
            className="flex-shrink-0 px-6 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <span>View All History</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;