import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exampleQuestions } from '../api.js';
import SearchBar from '../components/SearchBar.jsx';
import { addSearchHistory } from '../utils/storage.js';

export default function Home() {
  const navigate = useNavigate();

  const runExample = (question) => {
    addSearchHistory(question);
    navigate(`/results?q=${encodeURIComponent(question)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-250px)] items-center justify-center">
      <section className="w-full py-12 text-center sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Supreme Court research, grounded in citations
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold tracking-tight text-navy dark:text-white sm:text-6xl">
          Ask plain-language legal research questions.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          LexSearch finds relevant Supreme Court of India judgments, explains the answer with sources, and keeps every conclusion tied to a citation.
        </p>

        <div className="mx-auto mt-10 flex justify-center">
          <SearchBar />
        </div>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Answers come only from real judgments.
        </p>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3" aria-label="Example questions">
          {exampleQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => runExample(question)}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gold hover:text-navy focus:outline-none focus:ring-4 focus:ring-gold/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white"
            >
              {question}
              <ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
