import { GitCompareArrows } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { findSimilarCases } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import UploadDropzone from '../components/UploadDropzone.jsx';
import { useToast } from '../hooks/useToast.js';

export default function FindSimilar() {
  const [facts, setFacts] = useState('');
  const [state, setState] = useState({ loading: false, results: [], selected: null });
  const { pushToast } = useToast();

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, results: [], selected: null });
    const results = await findSimilarCases(facts);
    setState({ loading: false, results, selected: results[0] || null });
  };

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Precedent Finder" title="Find similar cases" description="Paste case facts or mock-upload a PDF/DOCX to identify similar fact patterns and legal questions." />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="facts">Case facts</label>
          <textarea id="facts" value={facts} onChange={(event) => setFacts(event.target.value)} rows={12} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" placeholder="Paste facts, procedural posture, and issues..." />
        </section>
        <aside className="space-y-4">
          <UploadDropzone onFile={(file) => {
            setFacts(`Mock extracted facts from ${file.name}. Tenant disputes eviction, statutory notice and comparable precedent required.`);
            pushToast('Mock file processed.');
          }} />
          <button type="submit" className="w-full rounded-lg bg-navy px-4 py-3 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy">Find similar cases</button>
        </aside>
      </form>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="space-y-3">
          {state.loading ? [1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-28" />) : state.results.length ? state.results.map((item) => (
            <button key={item.id} type="button" onClick={() => setState((current) => ({ ...current, selected: item }))} className={`w-full rounded-xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-gold dark:bg-slate-900 ${state.selected?.id === item.id ? 'border-gold ring-4 ring-gold/20' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gold">{item.similarity}% similar</p>
                  <h2 className="mt-1 font-semibold text-slate-950 dark:text-white">{item.name}</h2>
                </div>
                <GitCompareArrows className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200">similar facts: {item.similarFacts}</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-100">similar legal question: {item.similarQuestion}</span>
              </div>
            </button>
          )) : <EmptyState title="No similar cases yet" description="Paste facts or upload a document, then run the precedent finder." />}
        </section>
        <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          {state.selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-navy dark:text-white">Side-by-side compare</h2>
                <Link to={`/case/${state.selected.id}`} className="text-sm font-semibold text-gold hover:underline">Open case</Link>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Your facts</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{state.selected.compare.user}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Case facts</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{state.selected.compare.case}</p>
                </div>
              </div>
            </>
          ) : <p className="text-slate-600 dark:text-slate-300">Select a result to compare facts and issues.</p>}
        </aside>
      </div>
    </div>
  );
}
