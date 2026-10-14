import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ToastProvider from './components/ToastProvider.jsx';
import Alerts from './pages/Alerts.jsx';
import CaseDetail from './pages/CaseDetail.jsx';
import CitationCheck from './pages/CitationCheck.jsx';
import Draft from './pages/Draft.jsx';
import FindSimilar from './pages/FindSimilar.jsx';
import History from './pages/History.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Results from './pages/Results.jsx';
import Saved from './pages/Saved.jsx';
import Summarize from './pages/Summarize.jsx';

const getInitialTheme = () => {
  const stored = localStorage.getItem('lexsearch-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lexsearch-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        document.querySelector('[data-search-input="true"]')?.focus();
      }

      if (event.key === 'Escape') {
        document.activeElement?.blur?.();
        window.dispatchEvent(new CustomEvent('lexsearch:escape'));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <ToastProvider>
      <Layout theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/case/:caseId" element={<CaseDetail />} />
          <Route path="/similar" element={<FindSimilar />} />
          <Route path="/citation-check" element={<CitationCheck />} />
          <Route path="/summarize" element={<Summarize />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}
