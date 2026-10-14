import { AlertTriangle, CheckCircle2, CircleSlash, GitBranch, Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkCitation } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';

const statusStyles = {
  'Good Law': { icon: CheckCircle2, className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200' },
  Overruled: { icon: CircleSlash, className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200' },
  Criticized: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100' },
  Distinguished: { icon: GitBranch, className: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100' },
};

export default function CitationCheck() {
  const [input, setInput] = useState('Rangappa v. Sri Mohan');
  const [state, setState] = useState({ loading: false, error: '', result: null });

  const submit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    setState({ loading: true, error: '', result: null });
    try {
      setState({ loading: false, error: '', result: await checkCitation(input) });
    } catch {
      setState({ loading: false, error: 'Citation check failed.', result: null });
    }
  };

  const ResultIcon = state.result ? (statusStyles[state.result.status]?.icon || Info) : Info;

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Citation Checking" title="Check whether a case is still reliable" description="Enter a case name or citation to see treatment status, later cases, and a short citator explanation." />
      <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="citation-input">Case name or citation</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input id="citation-input" value={input} onChange={(event) => setInput(event.target.value)} className="h-12 flex-1 rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" />
          <button type="submit" className="rounded-lg bg-navy px-5 py-2 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy">Check</button>
        </div>
      </form>
      <div className="mt-6">
        {state.loading ? <Skeleton className="h-72" /> : state.result ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold ${statusStyles[state.result.status]?.className}`}>
                <ResultIcon className="h-4 w-4" aria-hidden="true" />
                {state.result.status}
              </span>
              {state.result.case && <Link to={`/case/${state.result.case.id}`} className="font-semibold text-navy hover:underline dark:text-gold">{state.result.case.name}</Link>}
            </div>
            <p className="mt-4 text-slate-700 dark:text-slate-200">{state.result.explanation}</p>
            <div className="mt-6 border-l-2 border-gold/40 pl-5">
              <h2 className="font-semibold text-navy dark:text-white">Later treatment timeline</h2>
              <div className="mt-4 space-y-4">
                {state.result.timeline.length ? state.result.timeline.map((item) => (
                  <div key={`${item.year}-${item.name}`} className="relative rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <span className="absolute -left-[1.85rem] top-4 h-3 w-3 rounded-full bg-gold" />
                    <p className="text-sm font-semibold text-gold">{item.year} · {item.treatment}</p>
                    <Link to={`/case/${item.caseId}`} className="mt-1 block font-semibold text-slate-900 hover:underline dark:text-white">{item.name}</Link>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.note}</p>
                  </div>
                )) : <p className="text-slate-600 dark:text-slate-300">No later treatment in mock data.</p>}
              </div>
            </div>
          </section>
        ) : (
          <EmptyState title="No citation checked yet" description="Try Rangappa, Sadanandan Bhadran, Krishna Janardhan Bhat, Suraj Lamp, or Mohit Minerals." />
        )}
      </div>
    </div>
  );
}
