# LexSearch Frontend

LexSearch is a React + Vite + Tailwind CSS mock frontend for an AI legal research assistant for Indian lawyers. It uses mock Supreme Court of India judgment data only. All backend-facing functions are kept in `src/api.js` so they can be replaced with Spring Boot calls later.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

## Project shape

- `src/api.js` - mock data and API-shaped functions
- `src/mock/` - mock Supreme Court cases, citator treatment, alerts, and feed data
- `src/components/` - reusable UI components
- `src/hooks/` - shared UI hooks
- `src/pages/` - route-level screens
- `src/utils/storage.js` - local saved-case and history helpers

## Implemented mock features

- Smart Case Search with filters, sorting, match explanations, skeleton loading, and source-grounded answers
- Q&A with numbered citation markers, citation hover highlighting, paragraph jumps, follow-up box, and copy-with-citations
- Case Detail with Summary, Full Text, Citations, Related Cases, reading controls, and save folders/notes
- Summarize pasted judgment with upload mock and short/detailed toggle
- Citation Check with Good Law, Overruled, Criticized, and Distinguished statuses plus later-treatment timeline
- Find Similar Cases with PDF/DOCX mock upload, similarity scores, tags, and side-by-side compare
- Drafting helper with structured editor output, sources used, verification warning, copy, mock DOCX, and regenerate section
- Alerts with active alert toggles, notification bell, feed read/unread state, and email frequency
- Global sidebar, command palette (`Ctrl/Cmd + K`), dark mode, toasts, empty states, and accessible focus states

## Notes

- This UI does not provide legal advice.
- Results are mocked from real Supreme Court judgment references across tenancy, cheque bounce, GST, and property topics.
- Saved cases and search history use `localStorage`.
