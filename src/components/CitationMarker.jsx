export default function CitationMarker({ marker, caseId, paragraph, onHover, onClick }) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover?.(caseId)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(caseId)}
      onBlur={() => onHover?.(null)}
      onClick={() => onClick?.({ caseId, paragraph })}
      className="mx-0.5 inline-flex rounded-md px-1.5 py-0.5 align-baseline text-sm font-bold text-gold transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold"
      aria-label={`Citation ${marker}`}
    >
      [{marker}]
    </button>
  );
}
