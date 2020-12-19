import *  as puppeteer from "puppeteer";
import Scraper from "./Scraper";
import Authentication from "./Authentication";
import  AutoScroll  from "./utils/AutoScroll";

(async() => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      "ignoreHTTPSErrors": true,
    });

    //Define and inject Dependencies
    const authentication = new Authentication();
    const autoScroll = new AutoScroll()
    const scraper = new Scraper(browser, authentication, autoScroll)

    const instagramPayload = await scraper.scrapeInstagram()
    console.log(instagramPayload)
  } catch (error) {
    console.log("Could not create a browser instance => : ", error);
  }
})();


