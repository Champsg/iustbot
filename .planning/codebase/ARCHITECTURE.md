# Architecture

## System Overview
The application is a full-stack automated notice bot for Islamic University of Science and Technology (IUST). It combines web scraping, a database, a web dashboard, and a Telegram bot into a single Node.js project.

## Components

### 1. Backend (Express + Node-cron)
- **Scraper Service**: Periodically (every 10 mins) fetches the IUST website, parses new notices, and compares them with the database.
- **Notification Service**: When a new notice is found, it uses the Telegram Bot API to notify all registered subscribers.
- **API Provider**: Serves a REST API for the frontend to fetch the latest notices and system status.
- **Static Host**: In production, it serves the bundled React frontend.

### 2. Database (Supabase/PostgreSQL)
- Acts as the central source of truth for both the bot and the web dashboard.
- Uses Upsert logic to ensure notice uniqueness based on the link.

### 3. Frontend (React + Vite)
- A modern, responsive dashboard with glassmorphism design.
- Features:
    - Live notice feed with search functionality.
    - Real-time "Last Checked" status from the backend.
    - Telegram subscription call-to-action.

### 4. Bot (Telegraf)
- A lightweight interface for users to register for push notifications without needing to visit the website.

## Data Flow
1. **Scrape Loop**: `node-cron` -> `scraper.js` -> `IUST website`.
2. **Persistence**: New notices -> `Supabase (PostgreSQL)`.
3. **Alerting**: New notice detection -> `bot.js` -> `Telegram subscribers`.
4. **Consumption**: User -> `React Web Dashboard` -> `Express API` -> `Supabase`.
