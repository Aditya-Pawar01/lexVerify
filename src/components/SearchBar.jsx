import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addSearchHistory } from '../utils/storage.js';

export default function SearchBar({
  compact = false,
  initialValue = '',
  placeholder = 'Ask a legal question, e.g. Can a landlord evict a tenant without notice?',
}) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    addSearchHistory(trimmed);
    navigate(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className={`relative w-full ${compact ? 'max-w-md' : 'max-w-3xl'}`}
      aria-label="Search judgments"
    >
      <Search
        aria-hidden="true"
        className={`pointer-events-none absolute left-4 text-slate-500 dark:text-slate-400 ${
          compact ? 'top-3.5 h-4 w-4' : 'top-5 h-5 w-5'
        }`}
      />
      <input
        data-search-input="true"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={`w-full rounded-xl border border-slate-200 bg-white pr-24 text-slate-950 shadow-soft outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${
          compact ? 'h-11 pl-11 text-sm' : 'min-h-16 pl-12 text-base sm:text-lg'
        }`}
        placeholder={placeholder}
        aria-label="Ask a legal research question"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className={`absolute rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800 dark:hover:text-slate-200 ${
            compact ? 'right-16 top-2.5' : 'right-20 top-4'
          }`}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button
        type="submit"
        className={`absolute rounded-lg bg-navy font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-gold/30 dark:bg-gold dark:text-navy dark:hover:bg-amber-500 ${
          compact ? 'right-1.5 top-1.5 h-8 px-3 text-sm' : 'right-2 top-2 h-12 px-5'
        }`}
      >
        Search
      </button>
    </form>
  );
}
