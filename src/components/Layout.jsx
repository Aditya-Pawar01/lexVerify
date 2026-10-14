import { Menu, Moon, Scale, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CommandPalette from './CommandPalette.jsx';
import NotificationBell from './NotificationBell.jsx';
import SearchBar from './SearchBar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children, theme, onToggleTheme }) {
  const location = useLocation();
  const showTopSearch = location.pathname !== '/';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    };

    const onEscape = () => {
      setSidebarOpen(false);
      setCommandOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('lexsearch:escape', onEscape);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('lexsearch:escape', onEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream text-slate-950 dark:bg-slate-950 dark:text-slate-50 md:grid md:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-cream/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <NavLink to="/" className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white dark:bg-gold dark:text-navy">
                <Scale className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="hidden text-lg font-bold tracking-tight sm:inline">LexSearch</span>
            </NavLink>

            {showTopSearch && (
              <div className="hidden flex-1 justify-center lg:flex">
                <SearchBar compact />
              </div>
            )}

            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="ml-auto hidden min-w-56 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:flex"
            >
              <span className="inline-flex items-center gap-2"><Search className="h-4 w-4" aria-hidden="true" /> Command</span>
              <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-xs dark:border-slate-700">Ctrl K</kbd>
            </button>

            <NotificationBell />

            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-gold hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-gold"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {showTopSearch && (
            <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 lg:hidden">
              <SearchBar compact />
            </div>
          )}
        </header>

        <main className="mx-auto min-h-[calc(100vh-178px)] max-w-[1200px] px-4 py-8 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          This tool supports research. It is not legal advice. Verify all citations.
        </footer>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
