import AuthenticationInterface from "./interfaces/Authentication";

export default class Authentication implements AuthenticationInterface {
  public page: any
  constructor(page){
    this.page = page
  }
  
  public async login(username: string, password: string): Promise<void>{
    try {
      // Type In User Login Cred.
      await this.page.type('input[name="username"]', username);
      await this.page.type('input[name="password"]', password);
  
      // Submit Form and Wait for Navigation.
      await Promise.all([
        this.page.click('button[type="submit"]'),
        this.page.waitForNavigation({ waitUntil: "load" }),
      ]);

      await this.removeModals();      
    } catch (error) {
      console.log("Could not login to page instance => ", error);
    }
  }

  public async removeModals(): Promise<void>{
    // Remove Save Password Modal and Wait for Navigation
    let notNowBtn = await this.page.$x("//button[contains(., 'Not Now')]");
    if (notNowBtn[0]) {
      await Promise.all([
        await notNowBtn[0].click(),
        this.page.waitForNavigation({ waitUntil: "load" }),
      ]);
    }

    // Remove Turn On Notification Modal
    notNowBtn = await this.page.$x("//button[contains(., 'Not Now')]");
    if (notNowBtn[0]) {
      await Promise.all([await notNowBtn[0].click()]);
    }
  }
}
