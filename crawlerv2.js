const puppeteer = require("puppeteer");
const fs = require("fs");
// const util = require('util');

async function scrapeURL(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const data = await page.$$eval("div.lubh-bar", el =>
      el.map(
        x =>
          new Object({
            time: x.getAttribute("aria-label"),
            height: x.getAttribute("style")
          })
      )
    );
    await browser.close();
    console.log(data);
    fs.writeFileSync("response.json", JSON.stringify(data), "utf-8");
    // console.log(attr.length)
    // return attr
  } catch (err) {
    console.log(err);
  }
}

let test_url =
  "https://www.google.com/search?q=pottruck+upenn&rlz=1C5CHFA_enUS810US810&oq=pottruck+upenn&aqs=chrome..69i57.5183j0j4&sourceid=chrome&ie=UTF-8";

scrapeURL(test_url);
// console.log('yo')
// console.log(vals)

async function getTrendyResults(url) {
  try {
    puppeteer.launch().then(async browser => {
      const page = await browser.newPage();
      await page.goto(url);
      page.once("load", () => console.log("Page loaded!"));
      const data = await page.$$eval("div.lubh-bar", el =>
        el.map(
          x =>
            new Object({
              time: x.getAttribute("aria-label"),
              height: x.getAttribute("style")
            })
        )
      );
      //
      await browser.close();
      console.log(data);
    });
  } catch (err) {
    console.log(err);
  }
}

/*

async function run(url) {
    try {
        puppeteer.launch().then(async browser => {
            const page = await browser.newPage();
            await page.goto(url);
            const location_name = await page.$eval(
                "div[data-attrid^=title] span",
                el => el.textContent
            );
            await page.waitFor(1000);
            const results = []; 
            for (let idx = 1; idx <= 7; idx++) {
                await page.click("div.ab_button[role^=button] span");
                await page.waitForSelector("ul li[role^=menuitem]");
                await page.click(`ul li[role^=menuitem]:nth-child(${idx})`);
                await page.waitFor(2000); 
                let key = await page.$eval("div.ab_button[role^=button] span", el => el.textContent);
                const data = await page.$$eval("div[aria-hidden^=false] div.lubh-bar", el =>
                    el.map(
                        x =>
                            new Object({
                                time: x.getAttribute("aria-label").split(":"),
                                occupancyPercent: x
                                    .getAttribute("style")
                                    .replace("height:", "")
                                    .replace("px;", "")
                                //   time: x.getAttribute("aria-label"),
                            })
                    )
                );
                results.push(new Object({ [key]: data }));
            } 
            await browser.close();

            console.log(JSON.stringify(results));
            fs.writeFileSync("response.json", JSON.stringify(results), "utf-8");
            // await fs.writeFileSync("response.json", JSON.stringify(data), "utf-8");
        });
    } catch (err) {
        console.log(err);
    }

}

*/

/*

#!/usr/bin/env node
// vim: set noexpandtab tabstop=2:

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const cookies_json_file = process.argv[2];
const url = process.argv[3];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const cookiesString = await fs.readFile(cookies_json_file);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie.apply(page, cookies);

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const content = await page.content();
        console.log(content);
        await browser.close();
    } catch (e) {console.log(e)}
})();


*/

/*

document.querySelectorAll('ul li[role^=menuitem]').length
# 7

i = 1; i <= 7
document.querySelector('ul li[role^=menuitem]:nth-child(1)')
<li role=​"menuitem" tabindex=​"0" jsaction=​"r.xMTlHWFAkUQ" data-rtid=​"iAPjeDBldNQ4" jsl=​"$x 2;​" data-day=​"1" class=​"lubh-sel">​Mondays​</li>

document.querySelector('ul li[role^=menuitem]:nth-child(6)')
<li role=​"menuitem" tabindex=​"0" jsaction=​"r.xMTlHWFAkUQ" data-rtid=​"iAPjeDBldNQ4" jsl=​"$x 2;​" data-day=​"6" class>​Saturdays​</li>

document.querySelector('ul li[role^=menuitem]:nth-child(7)')
<li role=​"menuitem" tabindex=​"0" jsaction=​"r.xMTlHWFAkUQ" data-rtid=​"iAPjeDBldNQ4" jsl=​"$x 2;​" data-day=​"0">​Sundays​</li>
*/

//document.querySelectorAll('ul li[role^=menuitem]') #results in days-of-week
//document.querySelector('div[data-attrid^=title] span') results in title tag
/*
async func(location :obj (optional), else just link) {
    const title = location.title
    const link = location.link

}
####### OR #### ########################
with the headless browser type in url google.com/...?query=pottruck
############ ############################
   x =>
            new Object({
              day: x.textContent,
              data_day: x.getAttribute("data-day")


*/

/*
NOTES:
- page.$(selector); runs a document.querySelector() within the page or null
- page.$$(selector); runs document.querySelectorAll() within the page or []
- page.$eval(selector, fn); runs document.querySelector() and passes it as a arg to fn
- page.$$eval(selector, fn); runs Array.from(document.querySelectorAll(selector)) and passes this as the first argument to a fn
*/

// run(
//     "https://www.google.com/search?q=cafe+4&rlz=1C5CHFA_enUS810US810&oq=cafe+4&aqs=chrome..69i57j69i60l3.1785j0j1&sourceid=chrome&ie=UTF-8"
// );
// run("https://www.google.com/search?q=noyes+fitness+center");

// let test_url =
//   "https://www.google.com/search?q=pottruck+upenn&rlz=1C5CHFA_enUS810US810&oq=pottruck+upenn&aqs=chrome..69i57.5183j0j4&sourceid=chrome&ie=UTF-8";
// let test2_url =
//   "https://www.google.com/search?q=cafe+4&rlz=1C5CHFA_enUS810US810&oq=cafe+4&aqs=chrome..69i57j69i60l3.1785j0j1&sourceid=chrome&ie=UTF-8";
// scrapeURL(test2_url);

/*
//drop down menu ; check into the data-day value
<ul class="OxYkzd i0lkUREuNP9s-_AHwAYCueXs" style="top: -35px;" jsname="qQBmo" role="menu" data-ved="2ahUKEwiA-qTnxpbnAhWxJzQIHT6ND5cQnWEoATAlegQIGRAC"><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" data-day="1">Mondays</li><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" class="lubh-sel" data-day="2">Tuesdays</li><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" data-day="3">Wednesdays</li><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" data-day="4">Thursdays</li><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" data-day="5">Fridays</li><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" data-day="6">Saturdays</li><li role="menuitem" tabindex="0" jsaction="r.xMTlHWFAkUQ" data-rtid="i0lkUREuNP9s" jsl="$x 2;" data-day="0">Sundays</li></ul>

pseudocode
-> get all the items from the drop-down menu and make them keys to an obj
-> iterate through the array-of-objects (time/freq objs); and when there's a
-> PM to AM shift call next on the keys built
-> might need to map for each of the key elements
->

*/