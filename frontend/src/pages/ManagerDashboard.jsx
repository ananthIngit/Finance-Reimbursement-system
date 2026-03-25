import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const StatCard = ({ label, value, sub, color, icon, onClick, gradient }) => {
  if (gradient) {
    return (
      <div
        onClick={onClick}
        className="rounded-[2rem] p-8 text-white relative overflow-hidden cursor-pointer
          hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] transform hover:-translate-y-2 transition-all duration-500 ease-out group
          bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/20 blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-orange-900/20 blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
          <p className="text-amber-100 text-xs font-extrabold uppercase tracking-widest drop-shadow-sm">{label}</p>
          <p className="text-5xl font-extrabold mt-3 drop-shadow-md tracking-tight">{value}</p>
          <p className="text-amber-100/90 text-sm mt-3 font-medium">{sub}</p>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
            <span className="text-sm font-bold tracking-wide uppercase">Review queue</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colors = {
    emerald: { text: 'text-emerald-600 dark:text-emerald-400', ring: 'bg-emerald-100 dark:bg-emerald-900/50', border: 'hover:border-emerald-400 dark:hover:border-emerald-500', shadow: 'hover:shadow-[0_15px_30px_-5px_rgb(16,185,129,0.2)]' },
    rose:    { text: 'text-rose-600 dark:text-rose-400',       ring: 'bg-rose-100 dark:bg-rose-900/50', border: 'hover:border-rose-400 dark:hover:border-rose-500', shadow: 'hover:shadow-[0_15px_30px_-5px_rgb(244,63,94,0.2)]' },
    blue:    { text: 'text-indigo-600 dark:text-indigo-400',   ring: 'bg-indigo-100 dark:bg-indigo-900/50', border: 'hover:border-indigo-400 dark:hover:border-indigo-500', shadow: 'hover:shadow-[0_15px_30px_-5px_rgb(99,102,241,0.2)]' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div
      onClick={onClick}
      className={`rounded-[2rem] border p-8 flex flex-col justify-between relative overflow-hidden
        bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/50 dark:border-slate-700/50
        transform hover:-translate-y-2 transition-all duration-500 ease-out group ${onClick ? 'cursor-pointer' : ''}
        ${c.border} ${c.shadow}`}
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${c.text}`}>{label}</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">{value}</p>
        </div>
        <div className={`p-3.5 rounded-2xl ${c.ring} shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <span className={c.text}>{icon}</span>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 relative z-10 flex items-center justify-between">
        <p className={`text-sm font-bold tracking-wide ${c.text} ${onClick ? 'group-hover:translate-x-1 transition-transform' : ''}`}>
          {sub}
        </p>
        {onClick && (
          <svg className={`w-4 h-4 ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
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
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Team Overview">
      <div className="space-y-8 max-w-7xl mx-auto perspective-1000">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Team Overview</h2>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">
              Detailed insights into your team's spending and approvals.
            </p>
          </div>
          {userProfile?.department_name && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Department: <span className="text-indigo-600 dark:text-indigo-400">{userProfile.department_name}</span>
              </span>
            </div>
          )}
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            gradient
            label="Attention needed"
            value={stats.pending_approvals || 0}
            sub="Requests awaiting your review"
            onClick={() => navigate('/manager/approvals?tab=pending')}
          />
          <StatCard
            label="Approved"
            value={stats.total_approved || 0}
            sub="View processed claims"
            color="emerald"
            onClick={() => navigate('/manager/approvals?tab=approved')}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Rejected"
            value={stats.total_rejected || 0}
            sub="View denied claims"
            color="rose"
            onClick={() => navigate('/manager/approvals?tab=rejected')}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Dept. Spend"
            value={`$${stats.department_spend || 0}`}
            sub="Total budget utilized"
            color="blue"
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* ── History CTA ── */}
        <div className="rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8
          bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)]
          transform transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] group">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100/50 dark:bg-slate-800/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex flex-shrink-0 items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Approval History</h3>
              <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                Access a complete audit log of all processed expenses by your team members over time.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/manager/approvals?tab=history')}
            className="flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold tracking-wide uppercase relative overflow-hidden group/btn
              bg-slate-900 text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500
              shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)]
              hover:-translate-y-1 transition-all duration-300 z-10"
          >
            <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover/btn:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <span className="relative z-10">Detailed History</span>
            <svg className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </AppLayout>
  );
};

export default ManagerDashboard;
