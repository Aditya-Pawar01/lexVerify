import { useState } from 'react';
import { summarizePastedJudgment } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import UploadDropzone from '../components/UploadDropzone.jsx';
import { useToast } from '../hooks/useToast.js';

export default function Summarize() {
  const [text, setText] = useState('');
  const [length, setLength] = useState('short');
  const [state, setState] = useState({ loading: false, error: '', summary: null });
  const { pushToast } = useToast();

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setState({ loading: false, error: 'Paste judgment text or upload a document first.', summary: null });
      return;
    }
    setState({ loading: true, error: '', summary: null });
    try {
      const summary = await summarizePastedJudgment(text, length);
      setState({ loading: false, error: '', summary });
      pushToast('Judgment summarized.');
    } catch {
      setState({ loading: false, error: 'Could not summarize this judgment.', summary: null });
    }
  };

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Case Summarization" title="Summarize pasted judgment" description="Paste judgment text or mock-upload a PDF/DOCX, then choose a short or detailed research summary." />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="judgment-text">Judgment text</label>
          <textarea
            id="judgment-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={14}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-serif text-lg leading-8 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
            placeholder="Paste judgment text here..."
          />
        </section>
        <aside className="space-y-4">
          <UploadDropzone onFile={(file) => {
            setText(`Mock extracted text from ${file.name}. The judgment discusses facts, issue, arguments, and ruling.`);
            pushToast('Mock document text extracted.');
          }} />
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Length</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {['short', 'detailed'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLength(item)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-gold ${length === item ? 'border-gold bg-gold/10 text-navy dark:text-gold' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button type="submit" className="mt-4 w-full rounded-lg bg-navy px-4 py-2 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy">
              {state.loading ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        </aside>
      </form>
      {state.error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{state.error}</div>}
      <div className="mt-6">
        {state.loading ? (
          <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-32" />)}</div>
        ) : state.summary ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(state.summary).map(([title, body]) => (
              <section key={title} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">{title}</h2>
                <p className="mt-3 font-serif text-lg leading-8 text-slate-800 dark:text-slate-100">{body}</p>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="No summary yet" description="Paste text, choose length, and generate a source-checking scaffold." />
        )}
      </div>
    </div>
  );
}
