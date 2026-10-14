import { Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { getSearchHistory } from '../utils/storage.js';

const formatDateTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export default function History() {
  const history = getSearchHistory();

  return (
    <div className="slide-up">
      <PageHeader eyebrow="History" title="Search history" description="Recent plain-language research questions from this browser." />
      {history.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          {history.map((item) => (
            <Link key={`${item.query}-${item.searchedAt}`} to={`/results?q=${encodeURIComponent(item.query)}`} className="flex items-start gap-3 rounded-lg p-4 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800">
              <Search className="mt-1 h-5 w-5 text-gold" aria-hidden="true" />
              <span>
                <span className="font-semibold text-slate-950 dark:text-white">{item.query}</span>
                <span className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><Clock className="h-4 w-4" aria-hidden="true" /> {formatDateTime(item.searchedAt)}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : <EmptyState title="No history yet" description="Searches appear here after you ask a question." />}
    </div>
  );
}
