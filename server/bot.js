import dotenv from 'dotenv';
dotenv.config();
import { Telegraf } from 'telegraf';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase Admin
let firebaseInitialized = false;
try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        const filePath = path.join(__dirname, 'firebase-service-account.json');
        serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    initializeApp({
        credential: cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('Firebase Admin initialized successfully.');
} catch (e) {
    console.warn('⚠️ Firebase initialization failed or credentials missing. Push notifications disabled:', e.message);
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token || 'PLACEHOLDER');

bot.start(async (ctx) => {
    const chatId = ctx.chat.id;
    const username = ctx.from.username || ctx.from.first_name;

    const { error } = await supabase
        .from('subscriptions')
        .upsert({ chat_id: chatId, username: username });

    if (error) {
        console.error('Subscription error:', error);
        ctx.reply('❌ Failed to subscribe. Please try again.');
    } else {
        ctx.reply('🔔 Welcome to IUST Notice Bot! You will now receive instant alerts for new notices.');
    }
});

bot.command('unsubscribe', async (ctx) => {
    const chatId = ctx.chat.id;
    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('chat_id', chatId);

    if (error) {
        ctx.reply('❌ Failed to unsubscribe.');
    } else {
        ctx.reply('🔕 Unsubscribed successfully.');
    }
});

async function notifySubscribers(notice) {
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
        console.log('Telegram bot token not set. Skipping notification.');
        return;
    }

    const { data: subs, error } = await supabase.from('subscriptions').select('chat_id');
    
    if (error || !subs) return;

    const message = `🚨 *New IUST Notice!*\n\n📁 *Category:* ${notice.category}\n📢 *Title:* ${notice.title}\n📅 *Date:* ${notice.date}\n\n🔗 [View Notice](${notice.link})`;

    for (const sub of subs) {
        try {
            await bot.telegram.sendMessage(sub.chat_id, message, { parse_mode: 'Markdown' });
        } catch (err) {
            console.error(`Failed to send message to ${sub.chat_id}:`, err.message);
        }
    }

    // === Send FCM Push Notification ===
    if (firebaseInitialized) {
        const fcmMessage = {
            data: {
                title: "New IUST Alert",
                body: notice.title,
                url: notice.link || ""
            },
            topic: "iust_notifications",
            android: {
                priority: "high"
            }
        };

        try {
            const response = await getMessaging().send(fcmMessage);
            console.log('Successfully sent FCM push notification:', response);
        } catch (error) {
            console.error('Error sending FCM push notification:', error.message);
        }
    }
}

async function notifyAdminOfError(error) {
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!adminChatId) {
        console.log('TELEGRAM_ADMIN_CHAT_ID not set. Skipping admin error notification.');
        return;
    }

    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' || process.env.TELEGRAM_BOT_TOKEN === 'PLACEHOLDER') {
        console.log('Telegram bot token not set/valid. Skipping admin error notification.');
        return;
    }

    const message = `⚠️ *IUST Bot Error Alert!*\n\n*Time:* ${new Date().toLocaleString()}\n*Error:* ${error.message || error}\n\n*Stack Trace:*\n\`\`\`\n${error.stack ? error.stack.slice(0, 1000) : 'N/A'}\n\`\`\``;

    try {
        await bot.telegram.sendMessage(adminChatId, message, { parse_mode: 'Markdown' });
        console.log('Error notification sent to Telegram admin.');
    } catch (err) {
        console.error('Failed to send error notification to admin:', err.message);
    }
}

export { bot, notifySubscribers, notifyAdminOfError };
