export default function EmptyState({ title, description, action }) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
