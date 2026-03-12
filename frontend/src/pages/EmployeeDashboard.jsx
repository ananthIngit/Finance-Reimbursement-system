import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

/* ── Reusable stat card ── */
const StatCard = ({ label, value, sub, color, icon, onClick }) => {
  const colors = {
    amber:   { bg: 'bg-amber-50 dark:bg-amber-950/30',  text: 'text-amber-600 dark:text-amber-400',  ring: 'bg-amber-100 dark:bg-amber-900/30', dot: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', ring: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-emerald-500' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-950/30',    text: 'text-rose-600 dark:text-rose-400',    ring: 'bg-rose-100 dark:bg-rose-900/30',    dot: 'bg-rose-500' },
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', ring: 'bg-indigo-100 dark:bg-indigo-900/30', dot: 'bg-indigo-500' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 cursor-pointer group
        bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
        hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700
        transition-all duration-200 flex items-start justify-between gap-4`}
    >
      <div className="min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${c.text}`}>{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{sub}</p>
      </div>
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${c.ring} group-hover:scale-105 transition-transform`}>
        <span className={c.text}>{icon}</span>
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
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-7 max-w-6xl">

        {/* ── Page header ── */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track your expense claims and reimbursement status.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Pending"
            value={stats.total_pending}
            sub="Awaiting approval"
            color="amber"
            onClick={() => navigate('/my-expenses?status=Pending')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Total Reimbursed"
            value={`$${stats.total_amount_claimed}`}
            sub="Paid out to date"
            color="indigo"
            onClick={() => navigate('/my-expenses?status=Reimbursed')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-7 text-white relative overflow-hidden shadow-lg">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-xl font-bold">Manage your expenses</h3>
              <p className="text-indigo-200 text-sm mt-1 max-w-md">
                Submit new reimbursement requests or view the details of your past claims.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => navigate('/add-expense')}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-indigo-700
                  hover:bg-indigo-50 shadow transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                + New claim
              </button>
              <button
                onClick={() => navigate('/my-expenses')}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-500/40 text-white border border-indigo-400/30
                  hover:bg-indigo-500/60 transition-all"
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
