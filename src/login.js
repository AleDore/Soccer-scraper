const USERNAME = "gigs.backend";
const PASSWORD = "SharedPasswordForGig1#";

async function login(page) {
  try {
    // Type In User Login Cred.
    await page.type('input[name="username"]', USERNAME);
    await page.type('input[name="password"]', PASSWORD);

    // Submit Form and Wait for Navigation.
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "load" }),
    ]);

    // Remove Save Password Modal
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
  } catch (error) {
    console.log("Could not login to page instance => ", error);
  }
}

module.exports = login;
