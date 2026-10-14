import { Scale } from 'lucide-react';
import { useState } from 'react';
import { loginMock } from '../api.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', role: 'lawyer' });
  const [state, setState] = useState({ loading: false, error: '', user: null });

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: '', user: null });

    try {
      const user = await loginMock(form);
      setState({ loading: false, error: '', user });
    } catch (error) {
      setState({ loading: false, error: error.message, user: null });
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white dark:bg-gold dark:text-navy">
          <Scale className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-navy dark:text-white">Sign in to LexSearch</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          A role-ready login shell for lawyers now, with judge and court research roles ready to connect later.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="advocate@example.com"
              required
            />
          </label>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-800 dark:text-slate-100">Role</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {['lawyer', 'judge'].map((role) => (
                <label
                  key={role}
                  className={`cursor-pointer rounded-lg border p-3 text-sm font-semibold capitalize transition ${
                    form.role === role
                      ? 'border-gold bg-gold/10 text-navy dark:text-gold'
                      : 'border-slate-200 text-slate-600 hover:border-gold dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                    className="sr-only"
                  />
                  {role}
                </label>
              ))}
            </div>
          </fieldset>

          {state.error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={state.loading}
            className="h-12 w-full rounded-lg bg-navy px-4 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-gold/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gold dark:text-navy"
          >
            {state.loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      </section>

      <aside className="rounded-xl border border-slate-200 bg-white/70 p-8 dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Built for research workflow</h2>
        <ul className="mt-5 space-y-4 text-slate-600 dark:text-slate-300">
          <li>Every answer displays supporting judgment sources.</li>
          <li>Saved cases and search history stay available locally.</li>
          <li>No legal advice is generated; the interface keeps verification prominent.</li>
        </ul>
        {state.user && (
          <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-slate-800 dark:text-slate-100">
            Signed in as <strong>{state.user.email}</strong> with role <strong>{state.user.role}</strong>.
          </div>
        )}
      </aside>
    </div>
  );
}
