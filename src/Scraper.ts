const login = require("./login");
const autoScroll = require("../utils/autoScroll");

async function scraper(browser) {
  const INSTAGRAM_URL = process.env.INSTAGRAM_URL;
  if (!INSTAGRAM_URL) {
    console.log("Missing environment variable INSTAGRAM_URL");
  }
  let page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(INSTAGRAM_URL, { waitUntil: "networkidle0", timeout: 0 });

  // Login and Scroll to Bottom to Fetch All Timeline Data.
  await login(page);
  await autoScroll(page);

  // Take a Screenshot for Comparison.
  await page.screenshot({
    path: "../instagram.png",
    fullPage: true,
  });

  // Get List of Posts and Compose New Objects
  const timeline = await page.evaluate(() => {
    let result = [];
    const posts = document.querySelectorAll("article._8Rm4L.M9sTE.L_LMM.SgTZ1");

    posts.forEach((post) => {
      // Calculate Post Likes
      const likedByText = post.querySelector("div.Nm9Fw span.Jv7Aj");
      const likedByNumber = post.querySelector("div.Nm9Fw button.sqdOP span")
        .innerHTML;
      const likes =
        likedByText.getElementsByTagName("*").length + parseInt(likedByNumber);

      result.push({
        username: post.querySelector("header.Ppjfr span.Jv7Aj a.sqdOP.yWX7d")
          .innerHTML,
        imageUrl: post.querySelector("div.KL4Bh img.FFVAD").getAttribute("src"),
        caption: post.querySelector("span._8Pl3R span").innerHTML,
        likes,
      });
    });

    return result;
  });

  console.log(timeline);
}

module.exports = scraper;

import ScraperInterface from './interfaces/Scraper'

export default class Scraper implements ScraperInterface {
  public page: any
  public AuthModule: any
  constructor(page: any, authModule) {
    this.page = page
    this.AuthModule = authModule
  }

  async scrapeInstagram(): Promise<void>{
  // Login and Scroll to Bottom to Fetch All Timeline Data.
  await login(this.page);
  await autoScroll(this.page);

  // Take a Screenshot for Comparison.
  await this.page.screenshot({
    path: "../instagram.png",
    fullPage: true,
  });

  // Get List of Posts and Compose New Objects
  const timeline = await this.page.evaluate(() => {
    let result = [];
    const posts = document.querySelectorAll("article._8Rm4L.M9sTE.L_LMM.SgTZ1");

    posts.forEach((post) => {
      // Calculate Post Likes
      const likedByText = post.querySelector("div.Nm9Fw span.Jv7Aj");
      const likedByNumber = post.querySelector("div.Nm9Fw button.sqdOP span")
        .innerHTML;
      const likes =
        likedByText.getElementsByTagName("*").length + parseInt(likedByNumber);

      result.push({
        username: post.querySelector("header.Ppjfr span.Jv7Aj a.sqdOP.yWX7d")
          .innerHTML,
        imageUrl: post.querySelector("div.KL4Bh img.FFVAD").getAttribute("src"),
        caption: post.querySelector("span._8Pl3R span").innerHTML,
        likes,
      });
    });
  }
}

}