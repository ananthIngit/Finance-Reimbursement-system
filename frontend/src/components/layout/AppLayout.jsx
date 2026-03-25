import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ThemeToggle';
import NotificationBell from "./NotificationBell";

/**
 * AppLayout — wraps all authenticated pages with:
 * - Collapsible sidebar (role-based nav)
 * - Sticky glass top bar (sidebar toggle + ThemeToggle + Notifications)
 * - Main content area
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar - Role-based logic lives inside this component */}
      <Sidebar collapsed={collapsed} />

      {/* Page shell */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* ── Top Bar ── */}
        <header className="h-14 flex items-center gap-3 px-5 sticky top-0 z-20
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
          border-b border-slate-200 dark:border-slate-800 flex-shrink-0">

          {/* Sidebar toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100
              dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          {title && (
            <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate hidden sm:block">
              {title}
            </h1>
          )}

          {/* Right slot */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            {actions}

            {/* ── Role-Based Guard ── */}
            {userRole === 'Employee' && (
              <>
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
                <NotificationBell />
              </>
            )}

            <ThemeToggle />
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;