export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div>
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={`rounded-t-lg px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold ${
              activeTab === tab.id
                ? 'border-b-2 border-gold text-navy dark:text-gold'
                : 'text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
}
