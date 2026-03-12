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
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all
        ${downloading
          ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950/60'
        }`}
    >
      {downloading ? (
        <>
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </>
      )}
    </button>
  );

  if (loading) {
    return (
      <AppLayout title="Financial Overview" actions={headerActions}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Financial Overview" actions={headerActions}>
      <div className="space-y-7 max-w-6xl">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage company payouts and track reimbursements.
            </p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Report date: <span className="text-slate-600 dark:text-slate-300 font-medium">{new Date().toLocaleDateString()}</span>
          </span>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Action card — gradient */}
          <div
            onClick={() => navigate('/finance/payouts')}
            className="rounded-xl p-6 text-white relative overflow-hidden cursor-pointer
              hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group
              bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Action Required</p>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{stats.pending_payment} pending</span>
              </div>
              <p className="text-4xl font-bold">{stats.pending_payment}</p>
              <p className="text-indigo-200 text-sm mt-1">Claims awaiting disbursement</p>
              <div className="flex items-center gap-1.5 mt-5 text-sm font-semibold">
                <span>Process payments</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Disbursed */}
          <div className="rounded-xl border p-6 flex flex-col justify-between
            bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">Total Disbursed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">${stats.total_payout}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full" />
              </div>
              <p className="text-xs mt-2 text-emerald-600 dark:text-emerald-400 font-medium">100% successful payouts</p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="rounded-xl border p-6 flex flex-col justify-between
            bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Total Transactions</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_paid}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <svg className="w-5 h-5 text-slate-400 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Lifetime processed claims</p>
          </div>
        </div>

        {/* ── Info tip ── */}
        <div className="flex items-start gap-3 p-4 rounded-xl text-sm
          bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
          <svg className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Use the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Action Required</span> card to navigate to the Payouts Queue and approve funds for employees.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceDashboard;
