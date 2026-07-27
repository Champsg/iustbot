# Testing

## Current Status
The project currently has **no automated tests**. This includes a lack of unit tests, integration tests, and end-to-end (E2E) tests. All verification is presently done manually by the developer.

## Missing Infrastructure
- **Unit Testing**: No tests for the core scraping logic in `server/scraper.js`, which is the most critical part of the application.
- **Integration Testing**: No tests for the Telegram bot handlers in `server/bot.js` or the interaction between the Express server and the Supabase database.
- **E2E Testing**: No automated verification of the frontend dashboard (`src/App.jsx`) and its ability to display notices correctly.
- **CI/CD**: There is no automated pipeline to run tests on push or pull requests.

## Recommended Testing Strategy

### 1. Unit Testing (High Priority)
- **Tool**: `vitest` or `jest`.
- **Target**: `server/scraper.js`.
- **Strategy**: Mock the `axios` responses from the IUST website and verify that the `scrapeNotices` function correctly parses various HTML structures (notices with dates, notices without dates, empty lists).

### 2. Integration Testing (Medium Priority)
- **Tool**: `supertest` for Express.
- **Target**: `server/index.js` and `server/bot.js`.
- **Strategy**: 
    - Test the `/api/notices` endpoint with a mocked Supabase client.
    - Test the Telegram bot commands (`/start`, `/unsubscribe`) by mocking the `telegraf` context.

### 3. End-to-End Testing (Low Priority)
- **Tool**: `Playwright` or `Cypress`.
- **Target**: The full application flow.
- **Strategy**: Use a staging Supabase project to verify that clicking "Subscribe" redirects to Telegram and that notices appear correctly in the search grid.

## Test Directory Structure (Proposed)
```text
tests/
├── unit/
│   └── scraper.test.js
├── integration/
│   ├── api.test.js
│   └── bot.test.js
└── e2e/
    └── dashboard.spec.js
```
