import { FileUp } from 'lucide-react';
import { useState } from 'react';

export default function UploadDropzone({ label = 'Drop a PDF or DOCX here', onFile }) {
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);

  const acceptFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFile?.(file);
  };

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        acceptFile(event.dataTransfer.files?.[0]);
      }}
      className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center transition focus-within:ring-4 focus-within:ring-gold/20 ${
        dragging
          ? 'border-gold bg-gold/10'
          : 'border-slate-300 bg-white/70 hover:border-gold dark:border-slate-700 dark:bg-slate-900/70'
      }`}
    >
      <FileUp className="h-8 w-8 text-gold" aria-hidden="true" />
      <span className="mt-3 font-semibold text-slate-900 dark:text-white">{fileName || label}</span>
      <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">PDF or DOCX, mock upload only</span>
      <input
        type="file"
        accept=".pdf,.docx"
        className="sr-only"
        onChange={(event) => acceptFile(event.target.files?.[0])}
      />
    </label>
  );
}
