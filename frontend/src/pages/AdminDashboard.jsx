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
        { label: 'Total Users',      value: stats.total_users,      color: 'text-slate-800 dark:text-white' },
        { label: 'Active Users',     value: stats.active_users,     color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Unassigned Roles', value: stats.unassigned_roles, color: 'text-amber-600 dark:text-amber-400' },
        { label: 'Deactivated',      value: stats.deactivated,      color: 'text-red-600 dark:text-red-400' },
      ]
    : [];

  const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border bg-white border-slate-300 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

  return (
    <AppLayout title="Admin Control Panel">
      <div className="space-y-6 max-w-7xl">

        {/* ── Page header ── */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage users, roles, and organizational hierarchy.</p>
        </div>

        {/* ── Stats Row ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                <p className={`text-3xl font-bold mt-1.5 tracking-tight ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── User Table ── */}
        <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          {/* Table header bar */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">User Directory</h3>
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3.5 py-1.5 text-sm rounded-lg border w-56
                bg-white border-slate-300 text-slate-900 placeholder-slate-400
                dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600 dark:border-indigo-400 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading users…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-white dark:bg-slate-900">
                  <tr>
                    {['User', 'Role', 'Department', 'Manager', 'Status', 'Actions'].map((h) => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${h === 'Actions' ? 'text-center' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.username}</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {user.role_name ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {user.role_name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{user.department || '—'}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{user.manager_name || 'No manager'}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                          ${user.is_active
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {user.is_active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold border transition
                              bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100
                              dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/50"
                          >
                            Edit roles
                          </button>
                          {user.is_active && (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold border transition
                                bg-red-50 text-red-700 border-red-200 hover:bg-red-100
                                dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit — {editingUser.username}
              </h2>
              <button onClick={() => setEditingUser(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Assign Role</label>
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
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Assign Manager</label>
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
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Department</label>
                <input
                  type="text"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  placeholder="e.g. IT, Sales, HR"
                  className={inputCls}
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={editingUser.is_active}
                  onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Account is active (uncheck to suspend)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
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
