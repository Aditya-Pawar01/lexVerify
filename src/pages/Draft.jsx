import { Copy, Download, RefreshCw, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { generateDraft } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useToast } from '../hooks/useToast.js';

export default function Draft() {
  const [form, setForm] = useState({ description: '', side: 'petitioner', documentType: 'argument', sections: '' });
  const [state, setState] = useState({ loading: false, draft: null });
  const { pushToast } = useToast();

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, draft: null });
    setState({ loading: false, draft: await generateDraft(form) });
  };

  const draftText = state.draft ? [state.draft.title, ...state.draft.sections.map((section) => `${section.heading}\n${section.body}`)].join('\n\n') : '';

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Drafting Help" title="Argument and memo drafting" description="Generate a structured research draft with sources used and a clear verification warning." />
      <div className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Case description
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={7} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" placeholder="Summarize facts and relief sought..." />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Side
              <select value={form.side} onChange={(event) => setForm({ ...form, side: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950">
                <option value="petitioner">Petitioner</option>
                <option value="respondent">Respondent</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Document
              <select value={form.documentType} onChange={(event) => setForm({ ...form, documentType: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950">
                <option value="argument">Argument</option>
                <option value="memo">Memo</option>
                <option value="bail application">Bail application</option>
              </select>
            </label>
          </div>
          <label className="mt-4 block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Relevant sections
            <input value={form.sections} onChange={(event) => setForm({ ...form, sections: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" placeholder="Section 138 NI Act, Section 139 NI Act" />
          </label>
          <button type="submit" className="mt-5 w-full rounded-lg bg-navy px-4 py-3 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy">{state.loading ? 'Drafting...' : 'Generate draft'}</button>
        </form>
        <section className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <ShieldAlert className="mt-0.5 h-5 w-5" aria-hidden="true" />
            <p className="text-sm font-semibold">Verify before use. This mock draft is research support, not legal advice, and all citations must be checked against source text.</p>
          </div>
          {state.loading ? <Skeleton className="h-96" /> : state.draft ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={async () => { await navigator.clipboard.writeText(draftText); pushToast('Draft copied.'); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700"><Copy className="h-4 w-4" /> Copy</button>
                  <button type="button" onClick={() => pushToast('Mock DOCX download queued.', 'info')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700"><Download className="h-4 w-4" /> Download as DOCX</button>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-navy dark:text-white">{state.draft.title}</h2>
                <div className="mt-5 space-y-5">
                  {state.draft.sections.map((section) => (
                    <section key={section.heading} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-slate-950 dark:text-white">{section.heading}</h3>
                        <button type="button" onClick={() => pushToast(`${section.heading} regenerated.`, 'info')} className="inline-flex items-center gap-1 text-sm font-semibold text-gold"><RefreshCw className="h-4 w-4" /> Regenerate section</button>
                      </div>
                      <p className="mt-3 leading-7 text-slate-700 dark:text-slate-200">{section.body}</p>
                    </section>
                  ))}
                </div>
              </article>
              <aside className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold text-navy dark:text-white">Sources used</h3>
                <div className="mt-3 space-y-3">
                  {state.draft.sources.map((source) => (
                    <a key={source.id} href={`/case/${source.id}`} className="block rounded-lg border border-slate-200 p-3 text-sm hover:border-gold dark:border-slate-700">
                      <span className="font-semibold text-slate-900 dark:text-white">{source.name}</span>
                      <span className="mt-1 block text-slate-500 dark:text-slate-400">{source.citation}</span>
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          ) : <EmptyState title="No draft yet" description="Fill the form and generate a structured draft with source references." />}
        </section>
      </div>
    </div>
  );
}
