# Coding Conventions

## Language & Runtime
- **JavaScript (ESM)**: The codebase uses modern ES Modules (`import`/`export`).
- **Node.js**: Backend runs on Node.js (v18+ recommended).

## Frontend Patterns (React)
- **Functional Components**: All components use functional syntax and hooks.
- **State Management**: Local state using `useState` and `useEffect` for data fetching.
- **Icons**: `lucide-react` is the standard icon library.
- **Animations**: `framer-motion` is used for entry animations and layout transitions.

## Backend Patterns (Express)
- **Async/Await**: Used consistently for database operations and scraping.
- **Middleware**: Standard use of `cors` and `express.json()`.
- **Modularity**: Logic is split into `scraper.js` (data acquisition) and `bot.js` (messaging).

## Naming Conventions
- **Files**: camelCase for logic files (`scraper.js`), PascalCase or camelCase for components (currently `App.jsx`).
- **Variables/Functions**: camelCase (`checkNotices`, `filteredNotices`).
- **Database Tables**: snake_case (`notices`, `subscriptions`, `bot_config`).

## Error Handling
- **Backend**: `try-catch` blocks wrap external service calls (axios, supabase).
- **Frontend**: `try-catch` in `useEffect` blocks to prevent dashboard crashes on API failure.

## Tooling
- **ESLint**: Configured in `eslint.config.js` using recommended rules for JS and React.
