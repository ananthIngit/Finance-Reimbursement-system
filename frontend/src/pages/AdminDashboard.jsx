import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [dropdownData, setDropdownData] = useState({ roles: [], managers: [] });
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Modal State
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes, dropRes] = await Promise.all([
                api.get(`admin-api/users/?search=${search}`),
                api.get('admin-api/stats/'),
                api.get('admin-api/dropdowns/')
            ]);
            setUsers(usersRes.data.results);
            setStats(statsRes.data);
            setDropdownData(dropRes.data);
        } catch (error) {
            console.error("Admin fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [search]);

    // Handle updating roles, managers, etc.
    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`admin-api/users/${editingUser.id}/`, {
                role: editingUser.role,
                manager: editingUser.manager,
                department: editingUser.department,
                is_active: editingUser.is_active
            });
            alert('User updated successfully!');
            setEditingUser(null);
            fetchDashboardData();
        } catch (error) {
            alert('Failed to update user.');
        }
    };

    // 👇 NEW: Dedicated Deactivate/Delete Function
    const handleDeactivateUser = async (userId) => {
        if (window.confirm("Are you sure you want to deactivate this user? They will no longer be able to log in.")) {
            try {
                await api.delete(`users/delete/${userId}/`);
                alert('User account deactivated successfully.');
                fetchDashboardData();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to deactivate user.');
            }
        }
    };

    return (
        <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            
            {/* Header */}
            <div className="flex justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Control Panel</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users, roles, and organizational hierarchy.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => {
                        localStorage.removeItem('access_token');
                        navigate('/');
                    }} className="px-4 py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Total Users</p>
                        <p className="text-3xl font-black text-gray-800 dark:text-white mt-2">{stats.total_users}</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Active Users</p>
                        <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">{stats.active_users}</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Unassigned Roles</p>
                        <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{stats.unassigned_roles}</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Deactivated</p>
                        <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">{stats.deactivated}</p>
                    </div>
                </div>
            )}

            {/* User Management Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Directory</h2>
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white w-64"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-white dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Manager</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{user.username}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.role_name ? (
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-bold dark:bg-indigo-900/30 dark:text-indigo-400">{user.role_name}</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold dark:bg-amber-900/30 dark:text-amber-400">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {user.department || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        {user.manager_name || 'No Manager'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {user.is_active ? 'Active' : 'Deactivated'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => setEditingUser(user)}
                                                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded shadow-sm text-sm dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800"
                                            >
                                                Edit Roles
                                            </button>
                                            
                                            {/* 👇 NEW: Dedicated Deactivate Button */}
                                            {user.is_active && (
                                                <button 
                                                    onClick={() => handleDeactivateUser(user.id)}
                                                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded shadow-sm text-sm dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition border border-red-200 dark:border-red-800"
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
            </div>

            {/* EDIT USER MODAL */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Configuration for {editingUser.username}</h2>
                        
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Assign Role</label>
                                <select 
                                    value={editingUser.role || ''} 
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">-- Select Role --</option>
                                    {dropdownData.roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Assign Manager</label>
                                <select 
                                    value={editingUser.manager || ''} 
                                    onChange={(e) => setEditingUser({...editingUser, manager: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">-- Select Manager --</option>
                                    {dropdownData.managers.map(m => (
                                        <option key={m.id} value={m.id}>{m.username} ({m.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                <input 
                                    type="text"
                                    value={editingUser.department || ''} 
                                    onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                                    placeholder="e.g., IT, Sales, HR"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input 
                                    type="checkbox"
                                    id="isActiveToggle"
                                    checked={editingUser.is_active}
                                    onChange={(e) => setEditingUser({...editingUser, is_active: e.target.checked})}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <label htmlFor="isActiveToggle" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Account is Active (Uncheck to Suspend)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard; 