import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFolders, getSavedCaseMeta, saveCaseDetails } from '../utils/storage.js';
import { useToast } from '../hooks/useToast.js';

export default function SaveCaseModal({ legalCase, open, onClose, onSaved }) {
  const { pushToast } = useToast();
  const meta = legalCase ? getSavedCaseMeta()[legalCase.id] : null;
  const [folder, setFolder] = useState(meta?.folder || 'Research');
  const [notes, setNotes] = useState(meta?.notes || '');

  useEffect(() => {
    if (!open || !legalCase) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open, legalCase, onClose]);

  useEffect(() => {
    if (!legalCase) return;
    const nextMeta = getSavedCaseMeta()[legalCase.id];
    setFolder(nextMeta?.folder || 'Research');
    setNotes(nextMeta?.notes || '');
  }, [legalCase]);

  if (!open || !legalCase) return null;

  const save = () => {
    saveCaseDetails(legalCase.id, { folder, notes });
    pushToast('Case saved with folder and notes.');
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="save-case-title">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="save-case-title" className="text-xl font-semibold text-navy dark:text-white">Save case</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{legalCase.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800" aria-label="Close save dialog">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Folder
            <select value={folder} onChange={(event) => setFolder(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950">
              {getFolders().map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" placeholder="Why is this case useful?" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:text-slate-200">Cancel</button>
          <button type="button" onClick={save} className="rounded-lg bg-navy px-4 py-2 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy">Save</button>
        </div>
      </div>
    </div>
  );
}
