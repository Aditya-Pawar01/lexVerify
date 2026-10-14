import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCases } from '../api.js';
import { sidebarItems } from './Sidebar.jsx';

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const items = useMemo(() => {
    const pages = sidebarItems.map((item) => ({ type: 'Page', label: item.label, path: item.path }));
    const cases = mockCases.slice(0, 8).map((item) => ({ type: 'Case', label: item.name, path: `/case/${item.id}` }));
    return [...pages, ...cases].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  if (!open) return null;

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/45 p-4 pt-24" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-gold" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 flex-1 bg-transparent outline-none"
            placeholder="Jump to page or recent case..."
            aria-label="Command search"
          />
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800" aria-label="Close command palette">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {items.length ? items.map((item) => (
            <button
              key={`${item.type}-${item.path}`}
              type="button"
              onClick={() => go(item.path)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800"
            >
              <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-gold">{item.type}</span>
            </button>
          )) : (
            <p className="p-6 text-center text-slate-500 dark:text-slate-400">No matching command.</p>
          )}
        </div>
      </div>
    </div>
  );
}
