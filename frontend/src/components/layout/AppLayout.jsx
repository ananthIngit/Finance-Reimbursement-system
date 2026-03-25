import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ThemeToggle';
import NotificationBell from "./NotificationBell";

/**
 * AppLayout — wraps all authenticated pages with:
 * - Collapsible sidebar (role-based nav)
 * - Sticky glass top bar (sidebar toggle + ThemeToggle + Notifications)
 * - Main content area
 * - Ambient floating background orbs
 */
const AppLayout = ({ children, title, actions }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');

  /* Get user role on mount */
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);
  }, []);

  /* Auto-collapse on small screens */
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500 overflow-hidden relative font-sans selection:bg-indigo-500/30">
      
      {/* ── Global Floating Background Elements ── */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite] z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-500/10 blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0" />
      <div className="fixed top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none animate-[bounce_10s_ease-in-out_infinite] z-0" />

      {/* Sidebar - Role-based logic lives inside this component */}
      <div className="relative z-30">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Page shell */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* ── Top Bar ── */}
        <header className="h-16 flex items-center gap-4 px-6 sticky top-0 z-40
          bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl
          border-b border-slate-200/50 dark:border-slate-800/50 flex-shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">

          {/* Sidebar toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100/80
              dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800/80 transition-all hover:scale-105 active:scale-95 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          {title && (
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate hidden sm:block tracking-tight drop-shadow-sm">
              {title}
            </h1>
          )}

          {/* Right slot */}
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            {actions}

            {/* ── Role-Based Guard ── */}
            {userRole === 'Employee' && (
              <>
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
                <div className="hover:scale-105 transition-transform">
                  <NotificationBell />
                </div>
              </>
            )}
            
            <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-transform">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 p-5 sm:p-8 overflow-x-hidden relative z-10 animate-[fade-in_0.4s_ease-out]">
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(150%) skewX(30deg); } }
        @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default AppLayout;