"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");

async function runPageScrape(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certifcate-errors",
      "--netifs-to-ignore=INTERFACE_TO_IGNORE",
      "--ignore-certifcate-errors-spki-list",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],
  });

  try {
    console.log("URL %s", url);
    const page = await browser.newPage();

    //"networkidle2"
    await page.goto(url, { waitUntil: "load" });
    // console.log(`visiting page ${} `)
    await page.waitFor(2000);
    // page.waitForSelector();
    // await page.waitForSelector("div.news-box >ul >li> div.txt-box");

    let params = new URL(page.url()).searchParams;
    let query = params.get("query");
    let pageNum = params.get("page") || "1";
    console.log(query);

    const articlesData = await page.evaluate(() => {
      let Arr = [];
      let newsBoxItems = document.querySelectorAll(
        "div.news-box >ul >li> div.txt-box"
      );
      if (typeof newsBoxItems === "undefined") {
        console.log("page doesnt contain elems");
        return;
      }

      for (var i = 0; i < newsBoxItems.length; i++) {
        elemChild = newsBoxItems[i].firstElementChild;
        pubAndDateArr = elemChild.nextElementSibling.nextElementSibling.innerText.split(
          /(?=[0-9])/g
        );

        Arr[i] = {
          title: elemChild.textContent.trim(),
          // link: elemChild.querySelector("a[href^='/link'").href,
          link: elemChild
            .querySelector("a[href^='/link'")
            .href.replace(/&token=(.*)/g, ""),
          platform: pubAndDateArr[0],
          date: pubAndDateArr.slice(1).join(""),
        };
      }
      //   pageNums = document.querySelector("#pagebar_container");
      curPage = document.querySelector("#pagebar_container >span").textContent;
      Arr.push(curPage);
      // if (curPage !== pageNum) {
      //   return;
      // }

      // console.log(newsBoxItems);
      return Arr;
    });
    // console.log(articlesData);
    console.log("length");
    console.log(articlesData.length);
    console.log(typeof articlesData);
    console.log(Array.isArray(articlesData));
    // curPage = articlesData.splice(-1)[0];
    // console.log(curPage);

    // curPage = articlesData.pop();
    // console.log(curPage);
    if (articlesData.splice(-1)[0] !== pageNum) {
      console.log("current page mismatch");
      return;
    }
    console.log(articlesData.length);
    if (articlesData.length == 0) {
      return;
    }
    // module.exports = articlesData;
    fs.writeFile(
      `./weixin_q_${decodeURIComponent(query)}_pg_${pageNum}.json`,
      JSON.stringify(articlesData, null, 3),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  } finally {
    await browser.close();
  }
}

let urls = [
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=1",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=2",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=3",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=4",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=5",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=6",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=7",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=8",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=9",
  // "https://weixin.sogou.com/weixin?type=2&query=%E8%81%8C%E9%97%AE&ie=utf8&s_from=input&_sug_=y&_sug_type_=&w=01019900&sut=9721&sst0=1597386857274&lkt=4%2C1597386847434%2C1597386857171&page=10",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=1",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=2",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=3",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=4",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=5",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=6",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=7",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=8",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=9",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=offer+%E5%B8%AE&ie=utf8&_sug_=y&_sug_type_=1&w=01015002&oq=offer+&ri=1&sourceid=sugg&stj=0%3B0%3B0%3B0&stj2=0&stj0=0&stj1=0&hp=92&hp1=&sut=3518&sst0=1597386902694&lkt=1%2C1597386901411%2C1597386901411&page=10",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=1",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=2",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=3",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=4",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=5",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=6",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=7",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=8",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=9",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E7%9B%B4%E9%80%9A%E7%A1%85%E8%B0%B7&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=4327&sst0=1597386921640&lkt=1%2C1597386921537%2C1597386921537&page=10",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=1",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=2",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=3",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=4",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=5",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=6",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=7",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=8",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=9",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E4%B9%9D%E7%AB%A0%E7%AE%97%E6%B3%95&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=5076&sst0=1597386941608&lkt=1%2C1597386941505%2C1597386941505&page=10",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=1",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=2",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=3",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=4",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=5",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=6",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=7",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=8",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=9",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E6%A2%A6&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=3404&sst0=1597386956090&lkt=1%2C1597386955986%2C1597386955986&page=10",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=1",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=2",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=3",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=4",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=5",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=6",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=7",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=8",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=9",
  "https://weixin.sogou.com/weixin?type=2&s_from=input&query=%E8%81%8C%E5%9B%BE&ie=utf8&_sug_=y&_sug_type_=&w=01019900&sut=6530&sst0=1597386985498&lkt=1%2C1597386985396%2C1597386985396&page=10",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  for (const url of urls) {
    await runPageScrape(url);
    await sleep(20000);
  }
  console.log("All complete!");
  while (true) {
    for (const url of arrayOfUrls) {
      await runPageScrape(url);
    }
  }
}
main().catch(console.error);
