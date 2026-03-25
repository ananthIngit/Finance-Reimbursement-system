import React, { useState } from 'react';

const FilterPanel = ({ filters, setFilters, categories, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const activeCount = Object.values(filters).filter((v) => v !== '').length;

  const selectCls =
    'w-full px-4 pt-6 pb-2 text-sm font-semibold text-slate-900 bg-white/50 dark:bg-slate-900/50 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none transition-all duration-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.2)] appearance-none cursor-pointer relative z-10';

  const labelCls = 'absolute left-4 top-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest z-20 pointer-events-none';

  return (
    <div className="relative z-30">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold tracking-wide uppercase shadow-sm transition-all duration-300 border-2
          ${isOpen || activeCount > 0
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-700/50 dark:text-indigo-300 shadow-[0_5px_15px_rgba(99,102,241,0.2)]'
            : 'bg-white/70 border-slate-200/50 text-slate-600 hover:bg-white hover:border-slate-300 dark:bg-slate-900/70 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600'} backdrop-blur-md`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-md">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full max-w-4xl p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 rounded-[2rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7)] animate-[fade-in_0.3s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Status */}
            <div className="relative group">
              <label className={labelCls}>Status</label>
              <select name="status" value={filters.status} onChange={handleChange} className={selectCls}>
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Category */}
            <div className="relative group">
              <label className={labelCls}>Category</label>
              <select name="category" value={filters.category} onChange={handleChange} className={selectCls}>
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* From date */}
            <div className="relative group">
              <label className={labelCls}>From date</label>
              <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className={selectCls} />
            </div>

            {/* To date */}
            <div className="relative group">
              <label className={labelCls}>To date</label>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className={selectCls} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={onClear}
              className="px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={() => { onApply(); setIsOpen(false); }}
              className="px-8 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-white
                bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600
                shadow-[0_10px_20px_-5px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
