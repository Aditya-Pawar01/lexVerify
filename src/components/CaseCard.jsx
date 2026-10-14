import { Bookmark, CalendarDays, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isCaseSaved, saveCaseDetails, toggleSavedCase } from '../utils/storage.js';
import { useState } from 'react';
import { useToast } from '../hooks/useToast.js';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export default function CaseCard({ legalCase, highlighted = false }) {
  const [saved, setSaved] = useState(isCaseSaved(legalCase.id));
  const { pushToast } = useToast();

  const onSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!saved) {
      saveCaseDetails(legalCase.id, { folder: 'Research', notes: '' });
      pushToast('Case saved to Research.');
    } else {
      toggleSavedCase(legalCase.id);
      pushToast('Case removed from saved cases.', 'info');
    }
    setSaved((value) => !value);
  };

  return (
    <Link
      to={`/case/${legalCase.id}`}
      className={`group block rounded-xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-gold/25 dark:bg-slate-900 ${
        highlighted
          ? 'border-gold ring-4 ring-gold/20'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <article aria-labelledby={`${legalCase.id}-title`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
              <Scale className="h-4 w-4" aria-hidden="true" />
              {legalCase.court}
            </p>
            <h3 id={`${legalCase.id}-title`} className="mt-2 text-lg font-semibold leading-6 text-slate-950 dark:text-white">
              {legalCase.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800"
            aria-label={saved ? 'Remove saved case' : 'Save case'}
          >
            <Bookmark className={`h-5 w-5 ${saved ? 'fill-gold text-gold' : ''}`} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatDate(legalCase.date)}
          </span>
          <span>{legalCase.citation}</span>
          <span>{legalCase.citedBy} citations</span>
        </div>
        <p className="mt-3 text-sm text-slate-600 line-clamp-2 dark:text-slate-300">{legalCase.snippet}</p>
        {legalCase.whyMatched && (
          <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Why this matched: {legalCase.whyMatched}
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Bench: {legalCase.bench}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {legalCase.sections.map((section) => (
            <span
              key={section}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {section}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
