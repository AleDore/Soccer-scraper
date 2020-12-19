const puppeteer = require("puppeteer");
const scraperController = require("./pageController");

(async() => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      "ignoreHTTPSErrors": true,
    });
  } catch (error) {
    console.log("Could not create a browser instance => : ", error);
  }
})();


scraperController(browserInstance);
