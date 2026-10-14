const SAVED_KEY = 'lexsearch-saved-cases';
const SAVED_META_KEY = 'lexsearch-saved-case-meta';
const HISTORY_KEY = 'lexsearch-history';
const FOLDERS_KEY = 'lexsearch-folders';

export function getSavedCaseIds() {
  return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
}

export function isCaseSaved(caseId) {
  return getSavedCaseIds().includes(caseId);
}

export function toggleSavedCase(caseId) {
  const current = getSavedCaseIds();
  const next = current.includes(caseId)
    ? current.filter((id) => id !== caseId)
    : [caseId, ...current];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
}

export function getFolders() {
  const stored = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]');
  return stored.length ? stored : ['Research', 'Arguments', 'Client notes'];
}

export function getSavedCaseMeta() {
  return JSON.parse(localStorage.getItem(SAVED_META_KEY) || '{}');
}

export function saveCaseDetails(caseId, details) {
  const next = {
    ...getSavedCaseMeta(),
    [caseId]: {
      folder: details.folder || 'Research',
      notes: details.notes || '',
      savedAt: new Date().toISOString(),
    },
  };
  localStorage.setItem(SAVED_META_KEY, JSON.stringify(next));

  if (!isCaseSaved(caseId)) {
    localStorage.setItem(SAVED_KEY, JSON.stringify([caseId, ...getSavedCaseIds()]));
  }

  return next[caseId];
}

export function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

export function addSearchHistory(query) {
  const trimmed = query.trim();
  if (!trimmed) return getSearchHistory();

  const next = [
    { query: trimmed, searchedAt: new Date().toISOString() },
    ...getSearchHistory().filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, 12);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}
