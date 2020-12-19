import AuthenticationInterface from "./interfaces/Authentication";

export default class Authentication implements AuthenticationInterface {
  public async login(page: any, username: string, password: string): Promise<void>{
    try {
      // Type In User Login Cred.
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
  
      // Submit Form and Wait for Navigation.
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: "load" }),
      ]);

      await this._removeModals(page);      
    } catch (error) {
      console.log("Could not login to page instance => ", error);
    }
  }

  private async _removeModals(page): Promise<void>{
    // Remove Save Password Modal and Wait for Navigation
    let notNowBtn = await page.$x("//button[contains(., 'Not Now')]");
    if (notNowBtn[0]) {
      await Promise.all([
        await notNowBtn[0].click(),
        page.waitForNavigation({ waitUntil: "load" }),
      ]);
    }

    // Remove Turn On Notification Modal
    notNowBtn = await page.$x("//button[contains(., 'Not Now')]");
    if (notNowBtn[0]) {
      await Promise.all([await notNowBtn[0].click()]);
    }
  }
}
