import { Folder } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockCases } from '../api.js';
import CaseCard from '../components/CaseCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { getSavedCaseIds, getSavedCaseMeta } from '../utils/storage.js';

export default function Saved() {
  const [savedIds, setSavedIds] = useState(getSavedCaseIds);
  const [meta, setMeta] = useState(getSavedCaseMeta);

  useEffect(() => {
    const refresh = () => {
      setSavedIds(getSavedCaseIds());
      setMeta(getSavedCaseMeta());
    };

    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const savedCases = mockCases.filter((item) => savedIds.includes(item.id));
  const folders = savedCases.reduce((groups, legalCase) => {
    const folder = meta[legalCase.id]?.folder || 'Research';
    return { ...groups, [folder]: [...(groups[folder] || []), legalCase] };
  }, {});

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Saved Cases" title="Saved cases with folders and notes" description="Organize authorities into research folders and keep short notes for later drafting." />
      <section aria-labelledby="saved-title">
          {savedCases.length ? (
            <div className="space-y-8">
              {Object.entries(folders).map(([folder, items]) => (
                <div key={folder}>
                  <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-950 dark:text-white">
                    <Folder className="h-5 w-5 text-gold" aria-hidden="true" />
                    {folder}
                  </h2>
                  <div className="space-y-4">
                    {items.map((legalCase) => (
                      <div key={legalCase.id}>
                        <CaseCard legalCase={legalCase} />
                        {meta[legalCase.id]?.notes && (
                          <p className="mt-2 rounded-lg border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                            Note: {meta[legalCase.id].notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved cases yet"
              description="Save important judgments from the results page or case detail view."
              action={
                <Link
                  to="/"
                  className="inline-flex rounded-lg bg-navy px-4 py-2 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-gold/25 dark:bg-gold dark:text-navy"
                >
                  Search judgments
                </Link>
              }
            />
          )}
        </section>
    </div>
  );
}
