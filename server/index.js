import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cron from 'node-cron';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { scrapeNotices } from './scraper.js';
import { bot, notifySubscribers, notifyAdminOfError } from './bot.js';
import axios from 'axios';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Check for new notices
async function checkNotices() {
    console.log('Checking for new notices...', new Date().toLocaleString());
    try {
        const notices = await scrapeNotices();
        
        for (const notice of notices) {
            // Check if notice already exists in DB
            const { data: existing, error: checkError } = await supabase
                .from('notices')
                .select('id')
                .eq('link', notice.link)
                .maybeSingle();

            if (checkError) {
                throw new Error(`Supabase query failed: ${checkError.message}`);
            }

            if (!existing) {
                console.log('New notice found:', notice.title);
                
                // Insert into DB
                const { error: insertError } = await supabase
                    .from('notices')
                    .insert([notice]);

                if (insertError) {
                    throw new Error(`Supabase insert failed: ${insertError.message}`);
                }

                // Notify subscribers
                await notifySubscribers(notice);
            }
        }

        // Update last checked time
        const { error: upsertError } = await supabase
            .from('bot_config')
            .upsert({ key: 'last_checked', value: new Date().toISOString() });
        
        if (upsertError) {
            throw new Error(`Supabase config update failed: ${upsertError.message}`);
        }
    } catch (error) {
        console.error('Error in checkNotices:', error);
        await notifyAdminOfError(error);
    }
}

// API Endpoints
app.get('/api/notices', async (req, res) => {
    const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/status', async (req, res) => {
    const { data, error } = await supabase
        .from('bot_config')
        .select('value')
        .eq('key', 'last_checked')
        .single();
    
    res.json({ last_checked: data ? data.value : null });
});

app.get('/api/ping', (req, res) => {
    res.json({ status: 'awake', timestamp: new Date().toISOString() });
});

app.get('/api/test-notify', async (req, res) => {
    try {
        const dummyNotice = {
            title: "Render Backend Live Test",
            link: "https://iust.ac.in",
            category: "Testing",
            date: new Date().toLocaleDateString()
        };
        await notifySubscribers(dummyNotice);
        res.json({ success: true, message: "Test notification sent to Telegram and FCM!" });
    } catch (error) {
        console.error("Test notification failed:", error);
        res.status(500).json({ error: error.message });
    }
});

// Run scheduler every 10 minutes
cron.schedule('*/10 * * * *', () => {
    checkNotices();
    
    // Self-ping to keep Render awake
    const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 3001}`;
    if (process.env.RENDER_EXTERNAL_URL) {
        console.log('Self-pinging to stay awake...');
        axios.get(`${process.env.RENDER_EXTERNAL_URL}/api/ping`).catch(() => {});
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server and bot
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Launch bot
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
        bot.launch().then(() => console.log('Telegram bot started'));
    } else {
        console.log('Telegram bot token missing, bot not started.');
    }

    // Initial check on start
    checkNotices();
});
