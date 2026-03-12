import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const StatCard = ({ label, value, sub, color, icon, onClick, gradient }) => {
  if (gradient) {
    return (
      <div
        onClick={onClick}
        className="rounded-xl p-5 text-white relative overflow-hidden cursor-pointer
          hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group
          bg-gradient-to-br from-amber-500 to-orange-600"
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none group-hover:bg-white/20 transition-all" />
        <div className="relative z-10">
          <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">{label}</p>
          <p className="text-4xl font-bold mt-1">{value}</p>
          <p className="text-amber-100 text-sm mt-1">{sub}</p>
          <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold">
            <span>Review queue</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const colors = {
    emerald: { text: 'text-emerald-600 dark:text-emerald-400', ring: 'bg-emerald-50 dark:bg-emerald-900/30' },
    rose:    { text: 'text-rose-600 dark:text-rose-400',       ring: 'bg-rose-50 dark:bg-rose-900/30' },
    blue:    { text: 'text-blue-600 dark:text-blue-400',       ring: 'bg-blue-50 dark:bg-blue-900/30' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 flex flex-col justify-between
        bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
        hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700
        transition-all duration-200 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${c.text}`}>{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${c.ring}`}>
          <span className={c.text}>{icon}</span>
        </div>
      </div>
      <p className={`text-xs mt-4 ${c.text} ${onClick ? 'opacity-60 group-hover:opacity-100 transition-opacity' : 'opacity-50'}`}>
        {sub}
      </p>
    </div>
  );
};

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ pending_approvals: 0, total_approved: 0, total_rejected: 0, department_spend: 0 });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          api.get('dashboard/manager/'),
          api.get('users/profile/'),
        ]);
        setStats(statsRes.data);
        setUserProfile(profileRes.data);
      } catch (error) {
        console.error('Failed to fetch manager data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Team Overview">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Team Overview">
      <div className="space-y-7 max-w-6xl">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Detailed insights into your team's spending and approvals.
            </p>
          </div>
          {userProfile?.department_name && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Dept: {userProfile.department_name}
            </span>
          )}
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            gradient
            label="Attention needed"
            value={stats.pending_approvals || 0}
            sub="Pending requests"
            onClick={() => navigate('/manager/approvals?tab=pending')}
          />
          <StatCard
            label="Approved"
            value={stats.total_approved || 0}
            sub="View details →"
            color="emerald"
            onClick={() => navigate('/manager/approvals?tab=approved')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Rejected"
            value={stats.total_rejected || 0}
            sub="View details →"
            color="rose"
            onClick={() => navigate('/manager/approvals?tab=rejected')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Dept. Spend"
            value={`$${stats.department_spend || 0}`}
            sub="Total budget used"
            color="blue"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* ── History CTA ── */}
        <div className="rounded-xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5
          bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
              <svg className="w-5 h-5 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Approval History</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Access a complete audit log of all processed expenses.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/manager/approvals?tab=history')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
              bg-slate-900 text-white hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500
              transition-all shadow-sm flex-shrink-0"
          >
            View all history
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </AppLayout>
  );
};

export default ManagerDashboard;
