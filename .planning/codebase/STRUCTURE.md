# Project Structure

```text
iustbot/
├── server/                 # Backend Application
│   ├── index.js            # Entry point (Express + Cron + Bot setup)
│   ├── scraper.js          # Web scraping logic for IUST website
│   └── bot.js              # Telegram bot commands and notification logic
├── src/                    # Frontend Application (React)
│   ├── assets/             # Static images and icons
│   ├── App.jsx             # Main dashboard component and state management
│   ├── App.css             # Component-specific styles
│   ├── index.css           # Global styles and design system tokens
│   └── main.jsx            # React entry point
├── public/                 # Static assets for the frontend build
├── .env                    # Environment variables (Supabase, Telegram tokens)
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
└── eslint.config.js        # Linting configuration
```
