import AutoScrollInterface from "../interfaces/AutoScroll";

export default class AutoScroll implements AutoScrollInterface{
  public async scroll(page: any): Promise<any> {
    await page.evaluate( () => {
       return new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
  
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
}