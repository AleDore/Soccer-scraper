import { InstagramResponse } from './interfaces/Responses';
import ScraperInterface from './interfaces/Scraper';

export default class Scraper implements ScraperInterface {
  public page: any
  public browser: any
  public AuthModule: any
  public instagramUrl: string
  public AutoScrollModule: any

  constructor(browser: any, authModule: any, autoScrollModule: any) {
    this.browser = browser
    this.AuthModule = authModule
    this.AutoScrollModule = autoScrollModule
    this.instagramUrl = process.env.INSTAGRAM_URL

    if(!this.instagramUrl) {
      console.log("Missing environment variable INSTAGRAM_URL");
    }
  }

  public async scrapeInstagram(): Promise<InstagramResponse[]>{
    // Get Login Cred.
    const username = process.env.INSTAGRAM_USERNAME
    const password = process.env.INSTAGRAM_PASSWORD

    if(!username || !password){
      console.log("Missing environment variable INSTAGRAM_USERNAME or INSTAGRAM_PASSWORD")
    }

  // Load Page, Login and Scroll to Bottom to Fetch All Timeline Data.
  await this._loadPage(this.instagramUrl)
  await this.AuthModule.login(this.page, username, password);
  await this.AutoScrollModule.scroll(this.page);

  // Take a Screenshot for Comparison.
  await this.page.screenshot({
    path: "../instagram.png",
    fullPage: true,
  });

  // Get List of Posts and Compose Response Objects
  const payload = await this.page.evaluate(() => {
    let result: InstagramResponse[] = [];
    const posts = document.querySelectorAll("article._8Rm4L.M9sTE.L_LMM.SgTZ1");

    posts.forEach((post) => {
      // Calculate Post Likes
      const likedText = post.querySelector("div.Nm9Fw span.Jv7Aj");
      const likedNumber = post.querySelector("div.Nm9Fw button.sqdOP span")?.innerHTML;

      // Normally This Would be Extracted Into It's Own Function But as the calling func 'this.page.evaluate'
      // Runs on the Browser Instead of Node, Reference to 'this' is Undefined
      let likes = 0
      if(likedText && likedNumber){
        console.log(likedNumber, likedText)
        likes = likedText.getElementsByTagName("*").length + parseInt(likedNumber.replace(/,/g, ''))
      }else if(likedText && !likedNumber){
        console.log(likedText)
        likes = likedText.getElementsByTagName("*").length
      } else if(!likedText && likedNumber){
        console.log(likedNumber)
        likes = parseInt(likedNumber.replace(/,/g, ''))
      }

      result.push({
        username: post.querySelector("header.Ppjfr span.Jv7Aj a.sqdOP.yWX7d")?.innerHTML,
        imageUrl: post.querySelector("div.KL4Bh img.FFVAD")?.getAttribute("src"),
        caption: post.querySelector("span._8Pl3R span")?.innerHTML,
        likes,
      });
    })
    return result
  })

  return payload
  }

  private async _loadPage(url: string): Promise<void>{
    try {
      const page = await this.browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });
      this.page = page
    } catch (error) {
      console.log(`Unable to connect to ${url} => `, error)
    }
  } 
}