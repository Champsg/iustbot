import axios from 'axios';
import { load } from 'cheerio';

async function scrapeNotices() {
    try {
        const { data } = await axios.get('https://iust.ac.in/default.aspx', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = load(data);
        const notices = [];
        const categories = [
            { id: 'General', name: 'General' },
            { id: 'Admissions', name: 'Admissions' },
            { id: 'Examinations', name: 'Examinations' },
            { id: 'PressRelease', name: 'Press Release' },
            { id: 'Recruitment', name: 'Recruitment' }
        ];

        for (const cat of categories) {
            $(`#${cat.id} ul li a`).each((i, el) => {
                const fullText = $(el).text().trim();
                const link = $(el).attr('href');
                
                if (!fullText || !link) return;

                // Extract date and title
                // Pattern: "DD-MM-YYYY: Title"
                const dateMatch = fullText.match(/^(\d{2}-\d{2}-\d{4}):\s*(.*)/);
                
                if (dateMatch) {
                    notices.push({
                        date: dateMatch[1],
                        title: dateMatch[2].trim(),
                        link: link.startsWith('http') ? link : `https://iust.ac.in/${link}`,
                        category: cat.name
                    });
                } else {
                    // Fallback for notices without date prefix
                    notices.push({
                        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
                        title: fullText,
                        link: link.startsWith('http') ? link : `https://iust.ac.in/${link}`,
                        category: cat.name
                    });
                }
            });
        }

        if (notices.length === 0) {
            throw new Error('Scraper parsed 0 notices. The website structure may have changed.');
        }

        return notices;
    } catch (error) {
        console.error('Scraping failed:', error);
        throw error;
    }
}

export { scrapeNotices };
