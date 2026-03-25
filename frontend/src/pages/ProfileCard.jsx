import React from 'react';

const ProfileCard = ({
    profile,
    formData,
    isEditing,
    onEdit,
    onCancel,
    onSave,
    onChange,
    onFileChange,
    accentColor = "indigo",
    roleLabel = "Employee"
}) => {

    const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1";
    const inputCls = "w-full px-3 py-2 text-sm rounded-lg border bg-white border-slate-300 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition";
    const valueCls = "text-sm font-medium text-slate-900 dark:text-slate-200";

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* ── Header Banner ── */}
                <div className={`h-32 bg-gradient-to-r from-${accentColor}-600 to-${accentColor}-800 relative`}>
                    <div className="absolute -bottom-12 left-8 flex items-end gap-5">
                        <div className="relative group">
                            <img
                                src={profile.profile_picture || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-lg"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </label>
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.username}</h1>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">{roleLabel}</span>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="pt-20 pb-8 px-8 space-y-8">

                    {/* Section: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Personal Details
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>First Name</label>
                                    {isEditing ? (
                                        <input name="first_name" value={formData.first_name} onChange={onChange} className={inputCls} />
                                    ) : <p className={valueCls}>{profile.first_name || '—'}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>Last Name</label>
                                    {isEditing ? (
                                        <input name="last_name" value={formData.last_name} onChange={onChange} className={inputCls} />
                                    ) : <p className={valueCls}>{profile.last_name || '—'}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Email Address</label>
                                <p className={valueCls}>{profile.email}</p>
                            </div>
                        </div>

                        {/* Section: Organization Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Work Info
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Department</label>
                                    <p className={valueCls}>{profile.department_name}</p>
                                </div>
                                <div>
                                    <label className={labelCls}>Reporting Manager</label>
                                    <p className={valueCls}>{profile.manager_name || 'Unassigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* 🏦 Section: Bank Details (CRITICAL FOR FINANCE) */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Reimbursement Method (Bank Details)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelCls}>Bank Name</label>
                                {isEditing ? (
                                    <input name="bank_name" value={formData.bank_name} onChange={onChange} placeholder="e.g. Chase" className={inputCls} />
                                ) : <p className={valueCls}>{profile.bank_name || '—'}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Account Number</label>
                                {isEditing ? (
                                    <input name="account_number" value={formData.account_number} onChange={onChange} placeholder="0000 0000 0000" className={inputCls} />
                                ) : <p className={valueCls}>{profile.account_number ? `****${profile.account_number.slice(-4)}` : '—'}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>IFSC / Routing Code</label>
                                {isEditing ? (
                                    <input name="ifsc_code" value={formData.ifsc_code} onChange={onChange} className={inputCls} />
                                ) : <p className={valueCls}>{profile.ifsc_code || '—'}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex justify-end gap-3 pt-4">
                        {!isEditing ? (
                            <button
                                onClick={onEdit}
                                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button onClick={onCancel} className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    Cancel
                                </button>
                                <button onClick={onSave} className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20">
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;