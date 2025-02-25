const express = require('express');
const puppeteer = require('puppeteer');
const cors = require("cors");
const http = require("http");
const https = require("https");
const app = express();
app.use(cors({
    origin: "*",  // Allow all origins (or specify your frontend URL)
    credentials: true
}));
const PORT = process.env.PORT || 3000; // Use the environment variable, fallback to 3000 for local dev
// Function to scrape news from any category
async function scrapeNews() {
   // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        headless: 'new', // Use the latest headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu','--disable-web-security']
    });
    const page = await browser.newPage();
    const url = `https://www.themoviedb.org/movie/`;
    //const url = `https://www.themoviedb.org/movie`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

       const articles = await page.evaluate(() => {
        const elements = document.querySelectorAll('.card.style_1');
        return Array.from(elements)
            .map(el => {
                const title = el.querySelector('.content h2 a')?.textContent.trim() || null;
                const rating = el.querySelector('.user_score_chart')?.getAttribute('data-percent') || null;
                const url = el.querySelector('.content h2 a') ? 'https://www.themoviedb.org' + el.querySelector('.content h2 a').getAttribute('href') : null;
                const img = el.querySelector('.wrapper.glyphicons_v2.picture.grey.no_image_holder img')?.getAttribute('src') || null;
                const time = el.querySelector('.content p')?.textContent.trim() || null;

                // Return only if all fields are present
                return (title && url && img && time) ? { title, rating, url, img, time } : null;
            })
            .filter(article => article !== null); // Remove null values
    });
    await browser.close();
    return articles;
}
app.use(express.json());
    app.get('/', async (req, res) => {
    try {
        const { category } = req.params;
        const data = await scrapeNews(category);
        res.json({ success: 'ok', articles: data });
    } catch (error) {

         // res.status(500).json({ error: 'Something went wrong!' });
       // return res.status(500).json({error: "Internal Server Error",details: error.message, });
          res.status(400).json({ error: 'Not Found!' });

    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = scrapeNews; // Export function