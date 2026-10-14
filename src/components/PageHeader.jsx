export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-gold">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy dark:text-white">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
