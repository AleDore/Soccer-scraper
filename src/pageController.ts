const pageScraper = require("./pageScraper");

async function scrape(browserInstance) {
  try {
    const browser = await browserInstance;
    await pageScraper(browser);
  } catch (error) {
    console.log("Could not resolve the browser instance => ", error);
  }
}

module.exports = scrape;
