import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { askFollowUp, mockCases, searchJudgments } from '../api.js';
import AnswerCard from '../components/AnswerCard.jsx';
import CaseCard from '../components/CaseCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useToast } from '../hooks/useToast.js';

const filterOptions = {
  yearRange: [
    ['all', 'All years'],
    ['pre-2000', 'Before 2000'],
    ['2000-2010', '2000-2010'],
    ['2011-2020', '2011-2020'],
    ['post-2020', 'After 2020'],
  ],
};

export default function Results() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [filters, setFilters] = useState({ court: 'all', yearRange: 'all', bench: 'all', section: 'all', sort: 'relevance' });
  const [state, setState] = useState({ loading: Boolean(query), error: '', answer: null, cases: [] });
  const [highlightedCaseId, setHighlightedCaseId] = useState(null);
  const [followUp, setFollowUp] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState(null);

  const courts = useMemo(() => ['all', ...new Set(mockCases.map((item) => item.court))], []);
  const benches = useMemo(() => ['all', ...new Set(mockCases.map((item) => item.bench))], []);
  const sections = useMemo(() => ['all', ...new Set(mockCases.flatMap((item) => item.sections))], []);

  useEffect(() => {
    let alive = true;

    if (!query) {
      setState({ loading: false, error: '', answer: null, cases: [] });
      return undefined;
    }

    setState((current) => ({ ...current, loading: true, error: '' }));

    searchJudgments(query, filters)
      .then((result) => {
        if (alive) setState({ loading: false, error: '', answer: result.answer, cases: result.cases });
      })
      .catch(() => {
        if (alive) setState({ loading: false, error: 'Search failed. Please try again.', answer: null, cases: [] });
      });

    return () => {
      alive = false;
    };
  }, [query, filters]);

  const onFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const jumpToCitation = ({ caseId, paragraph }) => {
    navigate(`/case/${caseId}?para=${paragraph}`);
  };

  const copyAnswer = async () => {
    if (!state.answer) return;
    await navigator.clipboard.writeText(state.answer.text);
    pushToast('Answer copied with citations.');
  };

  const submitFollowUp = async (event) => {
    event.preventDefault();
    if (!followUp.trim()) return;
    setFollowUpLoading(true);
    const answer = await askFollowUp(followUp, state.cases.map((item) => item.id));
    setFollowUpAnswer(answer);
    setFollowUpLoading(false);
  };

  if (!query) {
    return (
      <EmptyState
        title="Start with a legal question"
        description="Use the search box above or return to the home page to try an example question."
        action={
          <Link
            to="/"
            className="inline-flex rounded-lg bg-navy px-4 py-2 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-gold/25 dark:bg-gold dark:text-navy"
          >
            Go to search
          </Link>
        }
      />
    );
  }

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Smart Case Search" title={`Research for “${query}”`} description="Search plain-language questions across mock Supreme Court judgments with filters, source-grounded answers, and citation jumps." />

      {state.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnswerCard
            answer={state.answer}
            loading={state.loading}
            onCitationHover={setHighlightedCaseId}
            onCitationClick={jumpToCitation}
          />
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyAnswer}
                disabled={!state.answer}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-navy"
              >
                Copy answer with citations
              </button>
            </div>
            <form onSubmit={submitFollowUp} className="mt-4 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="follow-up">Follow-up question</label>
              <textarea
                id="follow-up"
                value={followUp}
                onChange={(event) => setFollowUp(event.target.value)}
                rows={3}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
                placeholder="Ask a narrower question about limitation, notice, or facts..."
              />
              <button type="submit" className="self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700">
                {followUpLoading ? 'Checking...' : 'Ask follow-up'}
              </button>
            </form>
            {(followUpLoading || followUpAnswer) && (
              <div className="mt-4">
                <AnswerCard answer={followUpAnswer} loading={followUpLoading} onCitationHover={setHighlightedCaseId} onCitationClick={jumpToCitation} />
              </div>
            )}
          </div>
        </div>

        <section aria-label="Supporting cases">
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Court
                <select
                  value={filters.court}
                  onChange={(event) => onFilterChange('court', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
                >
                  {courts.map((court) => (
                    <option key={court} value={court}>{court === 'all' ? 'All courts' : court}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Year range
                <select
                  value={filters.yearRange}
                  onChange={(event) => onFilterChange('yearRange', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
                >
                  {filterOptions.yearRange.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Bench
                <select
                  value={filters.bench}
                  onChange={(event) => onFilterChange('bench', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
                >
                  {benches.map((bench) => (
                    <option key={bench} value={bench}>{bench === 'all' ? 'All benches' : bench}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Statute section
                <select
                  value={filters.section}
                  onChange={(event) => onFilterChange('section', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>{section === 'all' ? 'All sections' : section}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Sort
                <select
                  value={filters.sort}
                  onChange={(event) => onFilterChange('sort', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="most-cited">Most cited</option>
                </select>
              </label>
            </div>
          </div>

          {state.loading ? (
            <div className="space-y-4" aria-label="Loading results">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-4 h-6 w-4/5" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : state.cases.length ? (
            <div className="space-y-4">
              {state.cases.map((legalCase) => (
                <CaseCard
                  key={legalCase.id}
                  legalCase={legalCase}
                  highlighted={highlightedCaseId === legalCase.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No supporting judgment found."
              description="Try a tenancy or Section 138 cheque bounce question, or loosen the filters."
            />
          )}
        </section>
      </div>
    </div>
  );
}
