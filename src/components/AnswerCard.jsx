import { useEffect, useMemo, useState } from 'react';
import CitationMarker from './CitationMarker.jsx';

const splitAnswer = (answer) => {
  if (!answer) return [];
  const markerPattern = /\[(\d+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = markerPattern.exec(answer.text))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: answer.text.slice(lastIndex, match.index) });
    }
    const marker = Number(match[1]);
    const citation = answer.citations.find((item) => item.marker === marker);
    parts.push({ type: 'citation', ...citation });
    lastIndex = markerPattern.lastIndex;
  }

  if (lastIndex < answer.text.length) {
    parts.push({ type: 'text', value: answer.text.slice(lastIndex) });
  }

  return parts;
};

export default function AnswerCard({ answer, loading, onCitationHover, onCitationClick }) {
  const parts = useMemo(() => splitAnswer(answer), [answer]);
  const totalChars = parts.reduce((sum, part) => sum + (part.type === 'text' ? part.value.length : 3), 0);
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    if (!answer) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setVisibleChars(totalChars);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setVisibleChars((value) => Math.min(value + 6, totalChars));
    }, 24);

    return () => window.clearInterval(timer);
  }, [answer, totalChars]);

  if (loading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 h-5 w-24 rounded skeleton" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded skeleton" />
          <div className="h-4 w-11/12 rounded skeleton" />
          <div className="h-4 w-4/5 rounded skeleton" />
        </div>
      </section>
    );
  }

  if (!answer) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Answer
        </h2>
        <p className="mt-4 font-serif text-xl leading-8 text-slate-900 dark:text-slate-100">
          No supporting judgment found.
        </p>
      </section>
    );
  }

  let consumed = 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Answer
      </h2>
      <p className="mt-4 font-serif text-xl leading-8 text-slate-950 dark:text-slate-50" aria-live="polite">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            const start = consumed;
            consumed += part.value.length;
            const shown = Math.max(0, Math.min(visibleChars - start, part.value.length));
            return <span key={`${part.value}-${index}`}>{part.value.slice(0, shown)}</span>;
          }

          const shouldShow = visibleChars >= consumed + 3;
          consumed += 3;
          if (!shouldShow) return null;

          return (
            <CitationMarker
              key={`${part.caseId}-${part.marker}`}
              marker={part.marker}
              caseId={part.caseId}
              paragraph={part.paragraph}
              onHover={onCitationHover}
              onClick={onCitationClick}
            />
          );
        })}
      </p>
    </section>
  );
}
