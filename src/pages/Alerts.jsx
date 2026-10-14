import { BellPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createAlert, getAlerts } from '../api.js';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useToast } from '../hooks/useToast.js';

export default function Alerts() {
  const [form, setForm] = useState({ topic: '', court: 'Supreme Court of India', section: '', caseId: '', frequency: 'daily' });
  const [state, setState] = useState({ loading: true, alerts: [], feed: [] });
  const { pushToast } = useToast();

  useEffect(() => {
    getAlerts().then((data) => setState({ loading: false, alerts: data.alerts, feed: data.feed }));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const alert = await createAlert(form);
    setState((current) => ({ ...current, alerts: [alert, ...current.alerts] }));
    setForm({ topic: '', court: 'Supreme Court of India', section: '', caseId: '', frequency: 'daily' });
    pushToast('Alert created.');
  };

  const toggleAlert = (id) => {
    setState((current) => ({
      ...current,
      alerts: current.alerts.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item),
    }));
  };

  const markRead = (id) => {
    setState((current) => ({
      ...current,
      feed: current.feed.map((item) => item.id === id ? { ...item, unread: false } : item),
    }));
  };

  return (
    <div className="slide-up">
      <PageHeader eyebrow="Alerts and Monitoring" title="Monitor legal developments" description="Create mock alerts by topic, court, statute section, or specific case. Review unread and read feed items." />
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <BellPlus className="h-7 w-7 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-semibold text-navy dark:text-white">Create alert</h2>
          {[
            ['topic', 'Topic'],
            ['section', 'Statute section'],
            ['caseId', 'Specific case ID'],
          ].map(([key, label]) => (
            <label key={key} className="mt-4 block text-sm font-semibold text-slate-800 dark:text-slate-100">
              {label}
              <input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" />
            </label>
          ))}
          <label className="mt-4 block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Court
            <input value={form.court} onChange={(event) => setForm({ ...form, court: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Email frequency
            <select value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-700 dark:bg-slate-950">
              <option value="instant">Instant</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <button type="submit" className="mt-5 w-full rounded-lg bg-navy px-4 py-3 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-gold dark:text-navy">Create alert</button>
        </form>
        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-navy dark:text-white">Active alerts</h2>
            {state.loading ? <Skeleton className="h-64" /> : state.alerts.length ? (
              <div className="space-y-3">
                {state.alerts.map((alert) => (
                  <article key={alert.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-950 dark:text-white">{alert.topic || alert.section || alert.caseId}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.court} · {alert.frequency}</p>
                      </div>
                      <button type="button" onClick={() => toggleAlert(alert.id)} className={`h-6 w-11 rounded-full p-0.5 transition focus:outline-none focus:ring-2 focus:ring-gold ${alert.enabled ? 'bg-gold' : 'bg-slate-300 dark:bg-slate-700'}`} aria-label={alert.enabled ? 'Disable alert' : 'Enable alert'}>
                        <span className={`block h-5 w-5 rounded-full bg-white transition ${alert.enabled ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : <EmptyState title="No alerts" description="Create an alert to monitor new judgments." />}
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-navy dark:text-white">Alerts feed</h2>
            <div className="space-y-3">
              {state.feed.map((item) => (
                <button key={item.id} type="button" onClick={() => markRead(item.id)} className={`w-full rounded-xl border bg-white p-4 text-left transition hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:bg-slate-900 ${item.unread ? 'border-gold' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex items-center gap-2">
                    {item.unread && <span className="h-2 w-2 rounded-full bg-gold" />}
                    <h3 className="font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.topic} · {item.date}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
