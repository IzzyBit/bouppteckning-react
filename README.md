# Bouppteckning — React, Vite och Tailwind

A modular version of the original Swedish bouppteckning single-page HTML application.

## Start

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Build with `npm run build`.

## File structure

- `src/app` — registers views and page navigation.
- `src/components/layout` — responsive toolbar and document sidebar.
- `src/components/ui` — reusable React fields, buttons, tables and repeaters.
- `src/context` — a single React state store using `useReducer`, with immutable updates.
- `src/models` — data model factories (`newEstateCase`, `newHeir`, etc.), import normalization, Word view adapter.
- `src/config` — navigation, heir types, legal text choices and financial categories.
- `src/features` — independent person, heir, meeting, clause, financial and Word pages.
- `src/utils` — Swedish currency formatting and financial calculations.
- `src/services/storage.js` — session-only drafts; `word.js` — DOCX generation logic.

## Add a new section

1. Create a React page in `src/features`.
2. Add a view to `src/app/App.jsx` and navigation entry to `src/config/navigation.js`.
3. Extend `newEstateCase()` with any new data; use `useCase().set()` for updates.
4. If it belongs in Word, update `src/services/word.js`.

## Data and privacy

- As in the original HTML, Save uses **sessionStorage** and does not send data to a server.
- Data may contain personal identity numbers. Avoid hosting with third-party analytics or copying real personal data to an untrusted environment.
- A browser tab/session draft is not a secure, backed-up case-management system. For actual multi-user usage, add authenticated backend persistence with appropriate access controls, encryption, audit logging and data protection review.
- Legal text and bodelning calculations were migrated from the supplied prototype, **not legally validated**.

## Notes

- Existing drafts stored under `bouppteckningDraft` are imported to the new state shape when compatible.
- The Word service reuses the original `docx` construction logic, now isolated from the DOM and receiving case data as an argument.
- Original `onclick`, `innerHTML` and mutable global arrays have been replaced with React state and event handlers.
