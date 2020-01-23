const puppeteer = require("puppeteer");

async function scrapeURL(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const attr = await page.$$eval("div.lubh-bar", el =>
      el.map(x => x.getAttribute("aria-label"))
    );

    await browser.close();
    console.log(attr);
  } catch (err) {
    console.log(err);
  }
}

let test_url =
  "https://www.google.com/search?q=pottruck+upenn&rlz=1C5CHFA_enUS810US810&oq=pottruck+upenn&aqs=chrome..69i57.5183j0j4&sourceid=chrome&ie=UTF-8";

scrapeURL(test_url);
