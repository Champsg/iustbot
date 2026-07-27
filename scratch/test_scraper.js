import axios from 'axios';
import { load } from 'cheerio';

async function testScraper() {
    try {
        const { data } = await axios.get('https://iust.ac.in/default.aspx', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = load(data);
        const notices = [];

        $('#General ul li a').each((i, el) => {
            const fullText = $(el).text().trim();
            console.log(`Index ${i}: "${fullText}"`);
            
            const dateMatch = fullText.match(/^(\d{2}-\d{2}-\d{4}):\s*(.*)/);
            if (dateMatch) {
                console.log(`  Match! Date: ${dateMatch[1]}, Title: ${dateMatch[2]}`);
            } else {
                console.log(`  No match for regex`);
            }
        });
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testScraper();
