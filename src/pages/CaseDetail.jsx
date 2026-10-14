import { Bookmark, Check, Clipboard, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getCaseById, getRelatedCases } from '../api.js';
import CaseCard from '../components/CaseCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ReadingControls from '../components/ReadingControls.jsx';
import SaveCaseModal from '../components/SaveCaseModal.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Tabs from '../components/Tabs.jsx';
import { useToast } from '../hooks/useToast.js';
import { isCaseSaved } from '../utils/storage.js';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

export default function CaseDetail() {
  const { caseId } = useParams();
  const [params] = useSearchParams();
  const paragraphFromUrl = Number(params.get('para'));
  const [activeTab, setActiveTab] = useState('summary');
  const [state, setState] = useState({ loading: true, error: '', case: null });
  const [relatedCases, setRelatedCases] = useState([]);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isCaseSaved(caseId));
  const [saveOpen, setSaveOpen] = useState(false);
  const [readingSettings, setReadingSettings] = useState({ fontSize: 18, lineWidth: 72, showParagraphNumbers: true });
  const { pushToast } = useToast();
  const paragraphRefs = useRef({});

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: '', case: null });

    getCaseById(caseId)
      .then((legalCase) => {
        if (alive) setState({ loading: false, error: '', case: legalCase });
        getRelatedCases(caseId).then((items) => {
          if (alive) setRelatedCases(items);
        });
      })
      .catch(() => {
        if (alive) setState({ loading: false, error: 'The requested case could not be found.', case: null });
      });

    return () => {
      alive = false;
    };
  }, [caseId]);

  useEffect(() => {
    if (!paragraphFromUrl || !state.case) return;
    setActiveTab('fullText');
    window.setTimeout(() => scrollToParagraph(paragraphFromUrl), 80);
  }, [paragraphFromUrl, state.case]);

  const scrollToParagraph = (paragraphNumber) => {
    const node = paragraphRefs.current[paragraphNumber];
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    node.classList.remove('highlight-pulse');
    window.requestAnimationFrame(() => node.classList.add('highlight-pulse'));
  };

  const copyCitation = async () => {
    if (!state.case) return;
    await navigator.clipboard.writeText(`${state.case.name}, ${state.case.citation}`);
    setCopied(true);
    pushToast('Citation copied.');
    window.setTimeout(() => setCopied(false), 1300);
  };

  const summarySections = useMemo(() => {
    if (!state.case) return [];
    return [
      ['Facts', state.case.summary.facts],
      ['Issue', state.case.summary.issue],
      ['Arguments', state.case.summary.arguments],
      ['Ruling', state.case.summary.ruling],
    ];
  }, [state.case]);

  if (state.loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-3 h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (state.error) {
    return <EmptyState title="Case not found" description={state.error} />;
  }

  const legalCase = state.case;

  const tabs = [
    {
      id: 'summary',
      label: 'Summary',
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          {summarySections.map(([title, content]) => (
            <section key={title} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">{title}</h2>
              <p className="mt-3 font-serif text-lg leading-8 text-slate-800 dark:text-slate-100">{content}</p>
            </section>
          ))}
        </div>
      ),
    },
    {
      id: 'fullText',
      label: 'Full Text',
      content: (
        <div className="space-y-4">
          <ReadingControls settings={readingSettings} onChange={setReadingSettings} />
          <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="mb-5 flex flex-wrap gap-2">
            {legalCase.relevantParagraphs.map((paragraph) => (
              <button
                key={paragraph}
                type="button"
                onClick={() => scrollToParagraph(paragraph)}
                className="rounded-full border border-gold/30 px-3 py-1 text-sm font-semibold text-gold transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                Jump to para {paragraph}
              </button>
            ))}
          </div>
          <div className="mx-auto space-y-5" style={{ maxWidth: `${readingSettings.lineWidth}ch` }}>
            {legalCase.paragraphs.map((paragraph, index) => {
              const number = index + 1;
              return (
                <p
                  key={number}
                  ref={(node) => {
                    paragraphRefs.current[number] = node;
                  }}
                  id={`paragraph-${number}`}
                  className="scroll-mt-32 rounded-lg p-2 font-serif leading-8 text-slate-800 dark:text-slate-100"
                  style={{ fontSize: `${readingSettings.fontSize}px` }}
                >
                  {readingSettings.showParagraphNumbers && (
                    <button
                      type="button"
                      onClick={() => scrollToParagraph(number)}
                      className="mr-3 rounded-md px-1.5 py-0.5 align-baseline text-sm font-bold text-gold focus:outline-none focus:ring-2 focus:ring-gold"
                      aria-label={`Scroll to paragraph ${number}`}
                    >
                      [{number}]
                    </button>
                  )}
                  {paragraph}
                </p>
              );
            })}
          </div>
          </article>
        </div>
      ),
    },
    {
      id: 'citations',
      label: 'Citations',
      content: (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-navy dark:text-white">Key citation anchors</h2>
          <div className="mt-4 space-y-3">
            {legalCase.relevantParagraphs.map((paragraph) => (
              <button
                key={paragraph}
                type="button"
                onClick={() => {
                  setActiveTab('fullText');
                  window.setTimeout(() => scrollToParagraph(paragraph), 60);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700"
              >
                <span className="font-medium text-slate-900 dark:text-white">Paragraph {paragraph}</span>
                <span className="text-sm text-gold">Open in full text</span>
              </button>
            ))}
          </div>
        </section>
      ),
    },
    {
      id: 'related',
      label: 'Related Cases',
      content: relatedCases.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {relatedCases.map((item) => <CaseCard key={item.id} legalCase={item} />)}
        </div>
      ) : (
        <EmptyState title="No related cases yet" description="Related authorities will appear here once connected to the case graph." />
      ),
    },
  ];

  return (
    <div className="slide-up">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Back to results
            </Link>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-navy dark:text-white">
              {legalCase.name}
            </h1>
            <dl className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-900 dark:text-white">Court</dt>
                <dd>{legalCase.court}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-white">Date</dt>
                <dd>{formatDate(legalCase.date)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-white">Bench</dt>
                <dd>{legalCase.bench}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-white">Citation</dt>
                <dd>{legalCase.citation}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyCitation}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-gold hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:text-slate-200 dark:hover:text-gold"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Clipboard className="h-4 w-4" aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy citation'}
            </button>
            <button
              type="button"
              onClick={() => setSaveOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy"
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
              {saved ? 'Saved' : 'Save case'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <SaveCaseModal
        legalCase={legalCase}
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSaved={() => setSaved(true)}
      />
    </div>
  );
}
