import { notifyAdminOfError } from '../server/bot.js';

// Setup environment mock variables
process.env.TELEGRAM_ADMIN_CHAT_ID = '123456789';
process.env.TELEGRAM_BOT_TOKEN = 'MOCK_BOT_TOKEN_12345';

// Mock bot telegram API
import { bot } from '../server/bot.js';

let messageSent = null;

bot.telegram = {
    sendMessage: async (chatId, message, options) => {
        messageSent = { chatId, message, options };
        console.log(`[MOCK TELEGRAM] Sending message to ${chatId}:`);
        console.log(message);
        return { message_id: 1 };
    }
};

async function runTest() {
    console.log('--- Running Error Notification Test ---');
    
    const mockError = new Error('Database connection timed out when fetching notices.');
    mockError.stack = 'Error: Database connection timed out\n  at checkNotices (server/index.js:33:12)\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)';

    await notifyAdminOfError(mockError);

    if (messageSent) {
        console.log('\n✅ Test passed! Message sent successfully.');
        if (messageSent.chatId === '123456789' && messageSent.message.includes('Database connection timed out')) {
            console.log('✅ Content verification passed.');
        } else {
            console.error('❌ Content verification failed.');
        }
    } else {
        console.error('❌ Test failed! No message sent.');
    }
}

runTest();
