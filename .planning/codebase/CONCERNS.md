# Areas of Concern

## Technical Debt

### 1. Lack of Automated Tests
The most significant concern is the absence of any automated testing. This makes the project highly susceptible to regressions, especially when the external IUST website structure changes.

### 2. JavaScript vs TypeScript
The project uses plain JavaScript. While sufficient for small projects, the lack of static typing for the `notice` objects and database responses increases the risk of runtime errors as the codebase grows.

### 3. Hardcoded Logic & UI
- **Inline Styles**: Some components in `src/App.jsx` use inline CSS, which should be moved to `App.css` or `index.css` for better maintainability.
- **Placeholder Checks**: The bot startup logic relies on a literal string check for `'YOUR_TELEGRAM_BOT_TOKEN'`, which is a fragile pattern for production configuration.

## Fragility & Reliability

### 1. Scraper Sensitivity
The scraping logic in `server/scraper.js` uses a specific CSS selector (`#General ul li a`). If the university website updates its DOM structure or ID naming, the bot will fail to find new notices silently.

### 2. Date Parsing
The parser expects a specific `DD-MM-YYYY` format. If the source website changes this format or omits the colon, the regex match will fail, and the bot will fall back to the current system date, potentially creating duplicate notices if the title is not unique enough.

## Security Concerns

### 1. Public API Endpoints
The `/api/notices` and `/api/status` endpoints are fully public. While the data is public on the IUST website anyway, this could lead to unnecessary load or scraping of the Supabase database if the endpoints are discovered.

### 2. Secret Management
The project relies on a `.env` file for all secrets. While standard, it requires careful manual management across development and production environments.

## Performance & Scalability

### 1. Rendering Self-Ping
The self-pinging mechanism is a workaround for Render's free tier sleep policy. This adds unnecessary traffic and relies on the `RENDER_EXTERNAL_URL` being correctly configured.

### 2. Database Growth
The backend currently returns the last 20 notices. As the number of notices grows into the hundreds or thousands, the frontend search will only operate on the subset provided by the API, leading to "missing" results for older notices. Pagination or a more robust search API is needed.

## Maintenance Risks
- **Dependency Management**: The project has several direct dependencies that will require regular updates to patch security vulnerabilities.
- **Bot Platform Lock-in**: The logic is tightly coupled with the Telegram Bot API via `telegraf`. Moving to another platform (e.g., Discord) would require a significant rewrite of `bot.js`.
