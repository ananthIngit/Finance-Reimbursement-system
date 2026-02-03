import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    total_pending: 0,
    total_approved: 0,
    total_rejected: 0,
    total_amount_claimed: 0
  });
  const [userProfile, setUserProfile] = useState(null); // <--- New State for Profile Pic
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. THE TRIGGER: Run this when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Dashboard Stats
        const statsRes = await api.get('dashboard/employee/');
        setStats(statsRes.data);

        // Fetch User Profile (To get the picture)
        const profileRes = await api.get('users/profile/');
        setUserProfile(profileRes.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
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
            
            {/* 👇 UPDATED PROFILE BUTTON: Shows Picture now 👇 */}
            <div 
              onClick={() => navigate('/profile')} 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition duration-200 group"
              title="View My Profile"
            >
              {/* Logic: Show Image if exists, otherwise show Initials/Icon */}
              <div className="relative">
                {userProfile?.profile_picture ? (
                  <img 
                    src={userProfile.profile_picture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-300 transition"
                  />
                ) : (
                  <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-transparent">
                    {userProfile?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                {/* Small indicator dot */}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
              </div>

              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-slate-800 leading-tight">
                  {userProfile?.username || "Employee"}
                </h1>
                <span className="text-xs text-slate-500 font-medium">View Profile</span>
              </div>
            </div>
            {/* 👆 END UPDATED PROFILE BUTTON 👆 */}

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
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 text-lg">Track your expense claims and reimbursement status.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Pending */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.total_pending}</h3>
              <p className="text-slate-400 text-xs mt-2">Awaiting approval</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 2: Approved */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">Approved</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.total_approved}</h3>
              <p className="text-slate-400 text-xs mt-2">Ready for payment</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 3: Rejected */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              <p className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-1">Rejected</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.total_rejected}</h3>
              <p className="text-slate-400 text-xs mt-2">Requires attention</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 4: Money */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-1">Total Claimed</p>
              <h3 className="text-3xl font-bold text-slate-800">${stats.total_amount_claimed}</h3>
              <p className="text-slate-400 text-xs mt-2">Lifetime volume</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

        </div>

        {/* Feature Section: Actions */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Manage Your Expenses</h3>
              <p className="text-indigo-100 mt-2 max-w-xl">
                Submit new reimbursement requests or view the details of your past claims quickly and easily.
              </p>
            </div>
            <button
              onClick={() => navigate('/my-expenses')}
              className="flex-shrink-0 bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              View All Expenses
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default EmployeeDashboard;