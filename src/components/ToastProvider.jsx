import { CheckCircle, Info, TriangleAlert, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ToastContext } from '../hooks/useToast.js';

const icons = {
  success: CheckCircle,
  warning: TriangleAlert,
  info: Info,
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const value = useMemo(() => ({
    pushToast(message, type = 'success') {
      const id = Date.now();
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 2800);
    },
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 space-y-2" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className="fade-in flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <Icon className={`h-5 w-5 ${toast.type === 'warning' ? 'text-amber-600' : toast.type === 'success' ? 'text-green-600' : 'text-gold'}`} aria-hidden="true" />
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gold dark:hover:bg-slate-800"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
