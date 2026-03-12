import React, { useState } from 'react';

const FilterPanel = ({ filters, setFilters, categories, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const activeCount = Object.values(filters).filter((v) => v !== '').length;

  const selectCls =
    'w-full px-3 py-2 text-sm rounded-lg border transition-colors ' +
    'bg-white border-slate-300 text-slate-700 ' +
    'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors
          ${isOpen || activeCount > 0
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-400'
            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
              <select name="status" value={filters.status} onChange={handleChange} className={selectCls}>
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
              <select name="category" value={filters.category} onChange={handleChange} className={selectCls}>
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* From date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">From date</label>
              <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className={selectCls} />
            </div>

            {/* To date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">To date</label>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className={selectCls} />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={() => { onApply(); setIsOpen(false); }}
              className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
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
