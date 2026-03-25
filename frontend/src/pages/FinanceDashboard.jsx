import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const FinanceDashboard = () => {
  const [stats, setStats] = useState({ pending_payment: 0, total_paid: 0, total_payout: 0 });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('dashboard/finance/');
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch finance data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const response = await api.get('expenses/export/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to download the report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  /* Download report button for AppLayout actions slot */
  const headerActions = (
    <button
      onClick={handleDownloadReport}
      disabled={downloading}
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold tracking-wide uppercase shadow-sm transition-all duration-300 border-2 backdrop-blur-md relative overflow-hidden group
        ${downloading
          ? 'bg-slate-100/50 text-slate-400 border-transparent cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600'
          : 'bg-emerald-50/50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-900/50 hover:shadow-[0_5px_15px_rgba(16,185,129,0.2)] active:scale-95'
        }`}
    >
      {!downloading && (
        <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      )}
      {downloading ? (
        <>
          <svg className="w-4 h-4 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="relative z-10">Generating…</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 relative z-10 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="relative z-10">Report</span>
        </>
      )}
    </button>
  );

  if (loading) {
    return (
      <AppLayout title="Financial Overview" actions={headerActions}>
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
    <AppLayout title="Financial Overview" actions={headerActions}>
      <div className="space-y-8 max-w-7xl mx-auto perspective-1000">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Financial Overview</h2>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">
              Manage company payouts and track reimbursements globally.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
              <span className="text-indigo-600 dark:text-indigo-400">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </span>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Action card — gradient */}
          <div
            onClick={() => navigate('/finance/payouts')}
            className="rounded-[2rem] p-8 text-white relative overflow-hidden cursor-pointer
              hover:shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transform hover:-translate-y-2 transition-all duration-500 ease-out group
              bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 dark:from-indigo-600 dark:via-indigo-800 dark:to-indigo-950"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/20 blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-400/30 blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-indigo-200 text-xs font-extrabold uppercase tracking-widest drop-shadow-sm">Action Required</p>
                <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-xl backdrop-blur-md shadow-sm border border-white/20 animate-pulse">
                  {stats.pending_payment} pending
                </span>
              </div>
              <p className="text-5xl font-extrabold tracking-tight drop-shadow-md">{stats.pending_payment}</p>
              <p className="text-indigo-200 text-sm mt-3 font-medium">Claims awaiting disbursement</p>
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                <span className="text-sm font-bold tracking-wide uppercase">Process payments</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Total Disbursed */}
          <div className="rounded-[2rem] border p-8 flex flex-col justify-between relative overflow-hidden
            bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/50 dark:border-slate-700/50
            transform hover:-translate-y-2 transition-all duration-500 ease-out hover:shadow-[0_15px_30px_-5px_rgb(16,185,129,0.2)] hover:border-emerald-400 dark:hover:border-emerald-500 group">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Total Disbursed</p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">${stats.total_payout}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
              <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full w-full rounded-full group-hover:animate-[pulse_2s_infinite]" />
              </div>
              <p className="text-xs mt-3 text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase">100% successful payouts</p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="rounded-[2rem] border p-8 flex flex-col justify-between relative overflow-hidden
            bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/50 dark:border-slate-700/50
            transform hover:-translate-y-2 transition-all duration-500 ease-out hover:shadow-[0_15px_30px_-5px_rgb(148,163,184,0.3)] hover:border-slate-400 dark:hover:border-slate-500 group">
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Total Transactions</p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">{stats.total_paid}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <svg className="w-6 h-6 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
              <p className="text-xs font-bold tracking-wide uppercase text-slate-400 dark:text-slate-500">Lifetime processed claims</p>
            </div>
          </div>
        </div>

        {/* ── Info tip ── */}
        <div className="flex items-start gap-4 p-5 rounded-2xl text-sm font-semibold
          bg-white/50 backdrop-blur-md border border-white/50 dark:border-slate-700/50 text-slate-600 dark:bg-slate-900/50 dark:text-slate-300 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />
          <svg className="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="leading-relaxed">
            Use the <span className="text-indigo-600 dark:text-indigo-400 mx-1 border-b-2 border-indigo-200 dark:border-indigo-900">Action Required</span> card to navigate to the Payouts Queue and approve funds for employees.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceDashboard;
