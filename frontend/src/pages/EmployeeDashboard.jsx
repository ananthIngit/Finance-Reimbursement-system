import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

/* ── Reusable stat card ── */
const StatCard = ({ label, value, sub, color, icon, onClick }) => {
  const colors = {
    amber:   { border: 'hover:border-amber-400 dark:hover:border-amber-500', shadow: 'hover:shadow-[0_10px_30px_rgb(245,158,11,0.2)]', text: 'text-amber-600 dark:text-amber-400', ring: 'bg-gradient-to-br from-amber-400 to-amber-600', iconColor: 'text-white' },
    emerald: { border: 'hover:border-emerald-400 dark:hover:border-emerald-500', shadow: 'hover:shadow-[0_10px_30px_rgb(16,185,129,0.2)]', text: 'text-emerald-600 dark:text-emerald-400', ring: 'bg-gradient-to-br from-emerald-400 to-emerald-600', iconColor: 'text-white' },
    rose:    { border: 'hover:border-rose-400 dark:hover:border-rose-500', shadow: 'hover:shadow-[0_10px_30px_rgb(244,63,94,0.2)]', text: 'text-rose-600 dark:text-rose-400', ring: 'bg-gradient-to-br from-rose-400 to-rose-600', iconColor: 'text-white' },
    indigo:  { border: 'hover:border-indigo-400 dark:hover:border-indigo-500', shadow: 'hover:shadow-[0_10px_30px_rgb(99,102,241,0.2)]', text: 'text-indigo-600 dark:text-indigo-400', ring: 'bg-gradient-to-br from-indigo-400 to-indigo-600', iconColor: 'text-white' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-[1.5rem] p-6 cursor-pointer group
        bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50
        transform transition-all duration-300 ease-out hover:-translate-y-2
        ${c.border} ${c.shadow}`}
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.text}`}>{label}</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">{value}</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">{sub}</p>
        </div>
        <div className={`p-3 rounded-2xl flex-shrink-0 ${c.ring} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <span className={c.iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    total_pending: 0,
    total_approved: 0,
    total_rejected: 0,
    total_amount_claimed: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('dashboard/employee/');
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Overview">
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
    <AppLayout title="Overview">
      <div className="space-y-8 max-w-6xl mx-auto perspective-1000">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Welcome back</h2>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">
            Track your expense claims and reimbursement status.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Pending"
            value={stats.total_pending}
            sub="Awaiting approval"
            color="amber"
            onClick={() => navigate('/my-expenses?status=Pending')}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Approved"
            value={stats.total_approved}
            sub="Ready for payment"
            color="emerald"
            onClick={() => navigate('/my-expenses?status=Approved')}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Rejected"
            value={stats.total_rejected}
            sub="Requires attention"
            color="rose"
            onClick={() => navigate('/my-expenses?status=Rejected')}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Reimbursed"
            value={`$${stats.total_amount_claimed}`}
            sub="Paid out to date"
            color="indigo"
            onClick={() => navigate('/my-expenses?status=Reimbursed')}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 transition-transform duration-500 mt-4 group">
          {/* Animated background blobs for the banner */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMXoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-20 pointer-events-none mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">Manage your expenses</h3>
              <p className="text-indigo-100 text-base font-medium mt-2 max-w-lg leading-relaxed">
                Submit new reimbursement requests instantly, or view the granular details of your past claims.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => navigate('/add-expense')}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-sm font-bold bg-white text-indigo-700 tracking-wide uppercase
                  hover:bg-indigo-50 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
              >
                + New claim
              </button>
              <button
                onClick={() => navigate('/my-expenses')}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-sm font-bold bg-indigo-500/30 text-white border border-indigo-400/40 tracking-wide uppercase backdrop-blur-sm
                  hover:bg-indigo-500/50 hover:border-indigo-300/60 hover:-translate-y-1 active:translate-y-0 shadow-lg transition-all duration-300 relative overflow-hidden group/btn"
              >
                View all
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default EmployeeDashboard;
