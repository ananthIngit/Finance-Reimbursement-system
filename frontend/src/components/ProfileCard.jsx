import React from 'react';
import AppLayout from './layout/AppLayout';

/**
 * Shared ProfileCard — renders an editable profile within AppLayout.
 *
 * Props:
 *   profile        — profile data object
 *   formData       — { first_name, last_name }
 *   isEditing      — boolean
 *   onEdit         — () => void
 *   onCancel       — () => void
 *   onSave         — () => void
 *   onChange       — (e) => void
 *   onFileChange   — (e) => void
 *   accentColor    — Tailwind color key: 'indigo' | 'emerald'
 *   roleLabel      — string shown under the username
 */
const ProfileCard = ({
  profile,
  formData,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onFileChange,
  accentColor = 'indigo',
  roleLabel,
}) => {
  const accent = {
    indigo: {
      headerBg: 'bg-indigo-600',
      avatarBg: 'bg-indigo-100 dark:bg-indigo-900/50',
      avatarText: 'text-indigo-500 dark:text-indigo-300',
      roleText: 'text-indigo-500 dark:text-indigo-400',
      editBtn: 'text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20',
      saveBtn: 'bg-indigo-600 hover:bg-indigo-700',
      focusRing: 'focus:ring-indigo-500',
    },
    emerald: {
      headerBg: 'bg-emerald-600',
      avatarBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      avatarText: 'text-emerald-500 dark:text-emerald-300',
      roleText: 'text-emerald-500 dark:text-emerald-400',
      editBtn: 'text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20',
      saveBtn: 'bg-emerald-600 hover:bg-emerald-700',
      focusRing: 'focus:ring-emerald-500',
    },
  }[accentColor] || {};

  const inputCls =
    'border rounded-lg px-2.5 py-1.5 w-1/2 text-right text-sm transition-colors ' +
    'bg-white border-slate-300 text-slate-900 ' +
    'dark:bg-slate-800 dark:border-slate-700 dark:text-white ' +
    'focus:outline-none focus:ring-2 ' + accent.focusRing;

  return (
    <AppLayout title="Profile">
      <div className="max-w-lg mx-auto animate-slide-up">

        {/* Card */}
        <div className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">

          {/* Accent header */}
          <div className={`h-24 ${accent.headerBg} relative`} />

          <div className="px-7 pb-7">
            {/* Avatar */}
            <div className="relative flex justify-center -mt-12 mb-5">
              <div className="relative h-24 w-24 rounded-full border-4 shadow-lg group overflow-hidden
                border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700">
                {profile.profile_picture ? (
                  <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className={`h-full w-full flex items-center justify-center text-3xl font-bold uppercase ${accent.avatarBg} ${accent.avatarText}`}>
                    {profile.username?.charAt(0) || 'U'}
                  </div>
                )}
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 gap-1">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[10px] font-semibold">Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                </label>
              </div>
            </div>

            {/* Name & role */}
            <div className="text-center mb-7">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.username}</h2>
              <p className="text-xs font-semibold uppercase tracking-widest mt-1">
                <span className={accent.roleText}>{roleLabel || profile.role_name || 'Employee'}</span>
              </p>
              {profile.email && (
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{profile.email}</p>
              )}
            </div>

            {/* Info rows */}
            <div className="space-y-3 mb-7">
              {/* First name */}
              <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">First name</span>
                {isEditing ? (
                  <input type="text" name="first_name" value={formData.first_name} onChange={onChange} placeholder="First name" className={inputCls} />
                ) : (
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.first_name || '—'}</span>
                )}
              </div>
              {/* Last name */}
              <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Last name</span>
                {isEditing ? (
                  <input type="text" name="last_name" value={formData.last_name} onChange={onChange} placeholder="Last name" className={inputCls} />
                ) : (
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.last_name || '—'}</span>
                )}
              </div>
              {/* Department */}
              {profile.department_name && (
                <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Department</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.department_name}</span>
                </div>
              )}
              {/* Role */}
              {profile.role_name && (
                <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Role</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900">
                    {profile.role_name}
                  </span>
                </div>
              )}
              {/* Manager */}
              {profile.manager_name !== undefined && (
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Manager</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.manager_name || 'None'}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={onSave}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-colors ${accent.saveBtn}`}
                  >
                    Save changes
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg text-sm font-medium border transition-colors
                      bg-white text-slate-600 border-slate-300 hover:bg-slate-50
                      dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={onEdit}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold border transition-colors ${accent.editBtn}`}
                >
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfileCard;
