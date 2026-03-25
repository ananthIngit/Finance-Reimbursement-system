import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosInstance';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('notifications/');
            console.log("Notifications Fetched:", response.data);
            setNotifications(response.data);
            const unread = response.data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`notifications/${id}/read/`);
            fetchNotifications();
        } catch (err) {
            console.error("Error marking read", err);
        }
    };

    // 🛠️ FIXED: Added 'e' to handle the click event properly
    const markAllAsRead = async (e) => {
        // 🛑 Stop the click from bubbling up and closing the dropdown
        if (e) e.stopPropagation();

        try {
            // Optimistic Update: Change UI immediately for better UX
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

            await api.patch('notifications/mark-all-read/');
            console.log("All notifications marked as read on server.");
        } catch (err) {
            console.error("Error marking all read", err);
            // Rollback if server fails
            fetchNotifications();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 p-3.5 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={(e) => markAllAsRead(e)}
                                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 p-1"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">No messages</div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.is_read && markAsRead(n.id)}
                                    className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/50 cursor-pointer ${!n.is_read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                                >
                                    <p className={`text-xs leading-relaxed ${!n.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {n.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;