import { scrapeNotices } from '../server/scraper.js';

async function verify() {
    console.log('Fetching notices using server/scraper.js...');
    try {
        const notices = await scrapeNotices();
        console.log(`\n✅ Success! Parsed ${notices.length} notices.`);
        if (notices.length > 0) {
            console.log('Sample notice:', JSON.stringify(notices[0], null, 2));
        }
    } catch (err) {
        console.error('❌ Verification failed:', err);
    }
}
verify();
