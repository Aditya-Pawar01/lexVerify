import { Hash, Pilcrow, Type } from 'lucide-react';

export default function ReadingControls({ settings, onChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="mb-2 flex items-center gap-2"><Type className="h-4 w-4 text-gold" aria-hidden="true" /> Font size</span>
          <input
            type="range"
            min="16"
            max="24"
            value={settings.fontSize}
            onChange={(event) => onChange({ ...settings, fontSize: Number(event.target.value) })}
            className="w-full accent-gold"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="mb-2 flex items-center gap-2"><Hash className="h-4 w-4 text-gold" aria-hidden="true" /> Line width</span>
          <input
            type="range"
            min="56"
            max="88"
            value={settings.lineWidth}
            onChange={(event) => onChange({ ...settings, lineWidth: Number(event.target.value) })}
            className="w-full accent-gold"
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={settings.showParagraphNumbers}
            onChange={(event) => onChange({ ...settings, showParagraphNumbers: event.target.checked })}
            className="h-4 w-4 rounded border-slate-300 accent-gold"
          />
          <Pilcrow className="h-4 w-4 text-gold" aria-hidden="true" />
          Paragraph numbers
        </label>
      </div>
    </div>
  );
}
