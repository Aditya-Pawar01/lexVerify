import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlerts } from '../api.js';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    getAlerts().then((data) => setFeed(data.feed));
  }, []);

  const unread = feed.filter((item) => item.unread);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-gold hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-gold"
        aria-label="Open notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread.length > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-950" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-white">New judgments</p>
            <Link to="/alerts" onClick={() => setOpen(false)} className="text-sm font-semibold text-gold hover:underline">View feed</Link>
          </div>
          <div className="space-y-2">
            {feed.slice(0, 3).map((item) => (
              <Link key={item.id} to="/alerts" onClick={() => setOpen(false)} className="block rounded-lg p-2 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {item.unread && <span className="h-2 w-2 rounded-full bg-gold" />}
                  {item.title}
                </span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{item.topic} · {item.date}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
