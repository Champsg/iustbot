# Integrations

## External Services
### 1. IUST Website (`https://iust.ac.in/`)
- **Purpose**: Source of notices.
- **Mechanism**: Web scraping using `axios` and `cheerio`.
- **Target**: Scrapes the `#General` section for notice titles, links, and dates.

### 2. Telegram Bot API
- **Purpose**: Instant notifications to users.
- **Mechanism**: `telegraf` library.
- **Functionality**:
    - `/start`: Subscribes users (saves `chat_id` to Supabase).
    - `/unsubscribe`: Removes user subscription.
    - Automatic notifications when a new notice is detected.

### 3. Supabase
- **Purpose**: Persistent storage.
- **Tables**:
    - `notices`: Stores unique notices (link, title, date, category).
    - `subscriptions`: Stores Telegram `chat_id` and `username`.
    - `bot_config`: Stores metadata like `last_checked` time.

### 4. Render (Deployment)
- **Purpose**: Hosting provider.
- **Integration**: Uses `RENDER_EXTERNAL_URL` environment variable for self-pinging to prevent the instance from sleeping.
