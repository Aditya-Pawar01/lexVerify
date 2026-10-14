import { Bell, Bookmark, FileCheck2, FilePenLine, History, Library, Search, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const sidebarItems = [
  { label: 'Search', path: '/', icon: Search },
  { label: 'Find Similar', path: '/similar', icon: Sparkles },
  { label: 'Citation Check', path: '/citation-check', icon: FileCheck2 },
  { label: 'Draft', path: '/draft', icon: FilePenLine },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Saved Cases', path: '/saved', icon: Bookmark },
  { label: 'History', path: '/history', icon: History },
  { label: 'Summarize', path: '/summarize', icon: Library },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold ${
    isActive
      ? 'bg-navy text-white dark:bg-gold dark:text-navy'
      : 'text-slate-600 hover:bg-white hover:text-navy dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
  }`;

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-slate-200 bg-cream p-4 transition-transform dark:border-slate-800 dark:bg-slate-950 md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 px-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Workspace</p>
          <p className="mt-2 text-lg font-bold text-navy dark:text-white">LexSearch</p>
        </div>
        <nav className="space-y-1" aria-label="Workspace">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className={linkClass} onClick={onClose}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
