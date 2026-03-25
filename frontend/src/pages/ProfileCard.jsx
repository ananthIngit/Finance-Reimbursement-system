import React from 'react';
import AppLayout from '../components/layout/AppLayout';

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

    const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1";
    // We update inputCls to match the "peer" floating style aesthetically, but for a standard form it's fine to just give it the thick glass style
    const inputCls = "w-full px-5 py-3.5 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)]";
    const valueCls = "text-base font-bold text-slate-900 dark:text-white px-5 py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border-2 border-transparent rounded-2xl";

    const content = (
        <div className="max-w-4xl mx-auto perspective-1000 animate-[fade-in_0.4s_ease-out]">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 overflow-hidden transform transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)]">

                {/* ── Header Banner ── */}
                <div className={`h-40 bg-gradient-to-br from-${accentColor}-600 via-${accentColor}-700 to-${accentColor}-900 relative overflow-hidden`}>
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgydjJIMXoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                    
                    <div className="absolute -bottom-16 left-10 flex items-end gap-6 z-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] p-1.5 bg-white/30 dark:bg-slate-800/50 backdrop-blur-md shadow-2xl">
                                <img
                                    src={profile.profile_picture || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-full h-full rounded-[1.5rem] object-cover"
                                />
                            </div>
                            <label className="absolute inset-1.5 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white rounded-[1.5rem] opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Update</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white drop-shadow-md tracking-tight">{profile.username}</h1>
                            <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 backdrop-blur-sm border border-indigo-400/30 shadow-sm uppercase tracking-widest">{roleLabel}</span>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="pt-24 pb-10 px-10 space-y-10">

                    {/* Section: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                Personal Details
                            </h3>

                            <div className="grid grid-cols-2 gap-5">
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
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </span>
                                Work Info
                            </h3>
                            <div className="grid grid-cols-2 gap-5">
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

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                    {/* 🏦 Section: Bank Details */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </span>
                            Reimbursement Method
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                            <div>
                                <label className={labelCls}>Bank Name</label>
                                {isEditing ? (
                                    <input name="bank_name" value={formData.bank_name} onChange={onChange} placeholder="e.g. Chase" className={`${inputCls} focus:border-emerald-500 focus:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)]`} />
                                ) : <p className={valueCls}>{profile.bank_name || '—'}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Account Number</label>
                                {isEditing ? (
                                    <input name="account_number" value={formData.account_number} onChange={onChange} placeholder="0000 0000 0000" className={`${inputCls} focus:border-emerald-500 focus:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)]`} />
                                ) : <p className={valueCls}>{profile.account_number ? `****${profile.account_number.slice(-4)}` : '—'}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>IFSC / Routing</label>
                                {isEditing ? (
                                    <input name="ifsc_code" value={formData.ifsc_code} onChange={onChange} className={`${inputCls} focus:border-emerald-500 focus:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)]`} />
                                ) : <p className={valueCls}>{profile.ifsc_code || '—'}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex justify-end gap-4 pt-6">
                        {!isEditing ? (
                            <button
                                onClick={onEdit}
                                className="px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm tracking-wide uppercase shadow-[0_10px_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(99,102,241,0.6)] hover:-translate-y-1 hover:bg-indigo-500 transition-all duration-300"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button onClick={onCancel} className="px-8 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm tracking-wide uppercase hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
                                    Cancel
                                </button>
                                <button onClick={onSave} className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 bg-[length:200%_auto] text-white font-bold text-sm tracking-wide uppercase hover:bg-[position:right_center] shadow-[0_10px_20px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                                    Save Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // ProfileCard is just a component. We will wrap it in AppLayout if it does not have it, but the parent (EmployeeProfile) doesn't have it either. Let's make sure it's wrapped. Wait, EmployeeProfile DOES NOT have AppLayout! Let's wrap AppLayout inside EmployeeProfile instead. But actually we can just return it from here to be safe and beautiful.
    // The previous implementation didn't wrap it in AppLayout. I'll wrap it in AppLayout right here!
    return (
        <AppLayout title="Profile">
            {content}
        </AppLayout>
    );

};

export default ProfileCard;