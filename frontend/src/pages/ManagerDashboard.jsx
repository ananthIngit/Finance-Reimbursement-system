import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    pending_approvals: 0,
    total_approved: 0,
    total_rejected: 0,
    department_spend: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('dashboard/manager/');
        console.log("Manager Stats:", response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch manager stats", error);
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Manager Portal</h1>
            </div>
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900">Team Overview</h2>
            <p className="text-slate-500 text-lg">Detailed insights into your team's spending and approvals.</p>
          </div>
          <p className="text-sm font-medium text-slate-400">
            Department: <span className="text-slate-600">Engineering</span> {/* Static for now, can be dynamic */}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Pending Approvals (High Importance) */}
          <div
            onClick={() => navigate('/manager/approvals?tab=pending')}
            className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
          >
            {/* Background decorative blob */}
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

          {/* Card 2: Team Approved */}
          <div
            onClick={() => navigate('/manager/approvals?tab=approved')}
            className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">Approved</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.total_approved || 0}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-4 group-hover:text-emerald-600 transition-colors">View details &rarr;</p>
          </div>

          {/* Card 3: Team Rejected */}
          <div
            onClick={() => navigate('/manager/approvals?tab=rejected')}
            className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-1">Rejected</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.total_rejected || 0}</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-4 group-hover:text-rose-600 transition-colors">View details &rarr;</p>
          </div>

          {/* Card 4: Dept Spending */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Dept. Spend</p>
                <h3 className="text-3xl font-bold text-slate-800">${stats.department_spend || 0}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-4">Total budget used</p>
          </div>

        </div>

        {/* Feature Section: History */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-slate-100 p-3 rounded-full hidden md:block">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Approval History</h3>
              <p className="text-slate-500 mt-1 max-w-2xl">
                Access a complete audit log of all expenses that have been processed by your team.
                Use this for monthly reconciliation and reporting.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/manager/approvals?tab=history')}
            className="flex-shrink-0 bg-slate-800 text-white px-6 py-2.5 rounded-lg hover:bg-slate-900 shadow transition-all flex items-center gap-2"
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