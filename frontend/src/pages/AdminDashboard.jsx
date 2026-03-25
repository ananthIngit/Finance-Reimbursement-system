import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import AppLayout from '../components/layout/AppLayout';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [dropdownData, setDropdownData] = useState({ roles: [], managers: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, dropRes] = await Promise.all([
        api.get(`admin-api/users/?search=${search}`),
        api.get('admin-api/stats/'),
        api.get('admin-api/dropdowns/'),
      ]);
      setUsers(usersRes.data.results);
      setStats(statsRes.data);
      setDropdownData(dropRes.data);
    } catch (error) {
      console.error('Admin fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchDashboardData(); }, [search]);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`admin-api/users/${editingUser.id}/`, {
        role: editingUser.role,
        manager: editingUser.manager,
        department: editingUser.department,
        is_active: editingUser.is_active,
      });
      alert('User updated successfully!');
      setEditingUser(null);
      fetchDashboardData();
    } catch {
      alert('Failed to update user.');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user? They will no longer be able to log in.')) {
      try {
        await api.delete(`users/delete/${userId}/`);
        alert('User account deactivated successfully.');
        fetchDashboardData();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to deactivate user.');
      }
    }
  };

  /* Stat numbers */
  const statItems = stats
    ? [
        { label: 'Total Users',      value: stats.total_users,      color: 'text-indigo-600 dark:text-indigo-400',       bg: 'bg-indigo-100 dark:bg-indigo-900/40',       border: 'hover:border-indigo-400 dark:hover:border-indigo-500',   shadow: 'hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.2)]' },
        { label: 'Active Users',     value: stats.active_users,     color: 'text-emerald-600 dark:text-emerald-400',     bg: 'bg-emerald-100 dark:bg-emerald-900/40',     border: 'hover:border-emerald-400 dark:hover:border-emerald-500', shadow: 'hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.2)]' },
        { label: 'Unassigned Roles', value: stats.unassigned_roles, color: 'text-amber-600 dark:text-amber-400',         bg: 'bg-amber-100 dark:bg-amber-900/40',         border: 'hover:border-amber-400 dark:hover:border-amber-500',     shadow: 'hover:shadow-[0_10px_20px_-5px_rgba(245,158,11,0.2)]' },
        { label: 'Deactivated',      value: stats.deactivated,      color: 'text-rose-600 dark:text-rose-400',           bg: 'bg-rose-100 dark:bg-rose-900/40',           border: 'hover:border-rose-400 dark:hover:border-rose-500',       shadow: 'hover:shadow-[0_10px_20px_-5px_rgba(244,63,94,0.2)]' },
      ]
    : [];

  const inputCls = 'w-full px-4 pt-6 pb-2 text-sm font-semibold text-slate-900 bg-slate-50 dark:bg-slate-800/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)] appearance-none cursor-pointer relative z-10';
  const labelCls = 'absolute left-4 top-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest z-20 pointer-events-none';

  return (
    <AppLayout title="Admin Control Panel">
      <div className="space-y-8 max-w-7xl mx-auto perspective-1000">

        {/* ── Page header ── */}
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Admin Control Panel</h2>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">Manage users, roles, and organizational hierarchy across the platform.</p>
        </div>

        {/* ── Stats Row ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map(({ label, value, color, bg, border, shadow }) => (
              <div key={label} className={`rounded-[2rem] border p-6 flex flex-col justify-between relative overflow-hidden
                bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/50 dark:border-slate-700/50
                transform hover:-translate-y-1 transition-all duration-500 ease-out group ${border} ${shadow}`}>
                <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 ${bg} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{label}</p>
                  <p className={`text-4xl font-extrabold tracking-tight drop-shadow-sm ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── User Table ── */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 mt-6 relative z-10">
          
          {/* Table header bar */}
          <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              User Directory
            </h3>
            <div className="relative group/search">
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 w-64 md:w-80
                  bg-white/50 border-slate-200/50 text-slate-900 placeholder-slate-400
                  dark:bg-slate-900/50 dark:border-slate-700/50 dark:text-white dark:placeholder-slate-500
                  focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_5px_15px_-3px_rgba(99,102,241,0.2)] transition-all duration-300 pl-11 backdrop-blur-sm"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide">Loading users…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
                <thead className="bg-transparent">
                  <tr>
                    {['User', 'Role', 'Department', 'Manager', 'Status', 'Actions'].map((h) => (
                      <th key={h} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ${h === 'Actions' ? 'text-center' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-transparent">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{user.username}</div>
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {user.role_name ? (
                          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                            {user.role_name}
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-md border border-amber-100 dark:border-amber-800/50">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-600 dark:text-slate-300">{user.department || '—'}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-600 dark:text-slate-300">{user.manager_name || '—'}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border
                          ${user.is_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 shadow-[0_2px_5px_rgba(16,185,129,0.1)]'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 shadow-[0_2px_5px_rgba(244,63,94,0.1)]'}`}>
                          {user.is_active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm
                              bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 hover:shadow-[0_5px_15px_-3px_rgba(79,70,229,0.4)]
                              dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-500 dark:hover:border-indigo-500 dark:hover:text-white"
                          >
                            Edit
                          </button>
                          {user.is_active && (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm
                                bg-white text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_5px_15px_-3px_rgba(244,63,94,0.4)]
                                dark:bg-transparent dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-600 dark:hover:text-white dark:hover:border-rose-600"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit User Modal ── */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-[fade-in_0.3s_ease-out]">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 p-8 w-full max-w-lg animate-[slide-up_0.4s_cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 shadow-inner">
                  {editingUser.username?.charAt(0).toUpperCase()}
                </div>
                Edit User
              </h2>
              <button onClick={() => setEditingUser(null)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-5 relative z-10">
              <div className="relative group">
                <label className={labelCls}>Assign Role</label>
                <select
                  value={editingUser.role || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— Select Role —</option>
                  {dropdownData.roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="relative group">
                <label className={labelCls}>Assign Manager</label>
                <select
                  value={editingUser.manager || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, manager: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— No Manager —</option>
                  {dropdownData.managers.map((m) => (
                    <option key={m.id} value={m.id}>{m.username} ({m.email})</option>
                  ))}
                </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

               <div className="relative group">
                <label className={labelCls}>Department</label>
                <input
                  type="text"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  placeholder=" "
                  className={inputCls}
                />
              </div>

              <div className="flex items-center gap-4 py-2 mt-2 px-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={editingUser.is_active}
                    onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                    className="w-5 h-5 opacity-0 absolute cursor-pointer peer"
                  />
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors flex items-center justify-center pointer-events-none shadow-sm peer-focus:ring-4 peer-focus:ring-indigo-500/20">
                    {editingUser.is_active && (
                       <svg className="w-4 h-4 text-white animate-[scale-in_0.2s_ease-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <label htmlFor="isActiveToggle" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  Account is active
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Uncheck to suspend user access</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-2xl text-white
                    bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600
                    shadow-[0_10px_20px_-5px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AdminDashboard;
