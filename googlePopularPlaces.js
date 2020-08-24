const puppeteer = require("puppeteer");
const fs = require("fs");

/**
 * @author Sergio Chairez <schairezv@gmail.com>
 */

/*
(TODO):
- implement version => !/usr/bin/env node with terminal argv values
- add a timestamp to the JSON 
- add headless to arg def of fn
 
(NOTE):
To use simply add your google place location search query to the run() function and puppeteer will  automatically conduct a google search query, parse the fields and write the obj to a json in your local directory.
The scrapper works for any location and is likely to work for the foreseeable future
since I relied on the tag attributes that won't change w/o a hefty redesign of the google search results. Runtime is 9-10 seconds avg on my machine; I used rate-limiting to slow down the fn 

Cheers,
Sergio
*/

//{ headless: false }
async function run(queryString) {
  const GOOGLE_URL_QUERY = "https://www.google.com/search?q=";

  const queryFormat = searchStr => searchStr.replace(/\s+/g, "+");
  const docSaveQueryFormat = searchStr => searchStr.replace(/\s+/g, "-");

  const full_query = GOOGLE_URL_QUERY + queryFormat(queryString);
  const d = { query: queryString };
  console.log(full_query);
  try {
    puppeteer.launch({ headless: false }).then(async browser => {
      const page = await browser.newPage();
      await page.goto(full_query);
      const location_name = await page.$eval(
        "div[data-attrid^=title] span",
        el => el.textContent
      );
      d["location_name"] = location_name;

      const results = [];
      for (let idx = 1; idx <= 7; idx++) {
        await page.click("div.ab_button[role^=button] span");
        await page.waitForSelector("ul li[role^=menuitem]");
        await page.click(`ul li[role^=menuitem]:nth-child(${idx})`);

        await page.waitFor(1000);
        let key = await page.$eval(
          "div.ab_button[role^=button] span",
          el => el.textContent
        );
        const data = await page.$$eval(
          "div[aria-hidden^=false] div.lubh-bar",
          el =>
            el.map(
              x =>
                new Object({
                  time: x.getAttribute("aria-label").replace(/:(.*)/g, ""),
                  busyDetailed: x
                    .getAttribute("aria-label")
                    .replace(/^.*?:/g, ""),
                  occupancyPercent: x
                    .getAttribute("style")
                    .replace("height:", "")
                    .replace("px;", "")
                })
            )
        );
        results.push(new Object({ [key]: data }));
      }
      await browser.close();
      d["histogram"] = results;
      // console.log(d);
      const doc_name = docSaveQueryFormat(queryString);
      fs.writeFileSync(
        `response-${doc_name}-${new Date().getTime()}.json`,
        JSON.stringify(d, null, 2),
        "utf-8"
      );
    });
  } catch (err) {
    console.log(err);
  }
}
run("Noyes Fitness Center");
