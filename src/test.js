const puppeteer = require('puppeteer');
const constants = require('./util/constants.js');

const jobTitle = 'Finance Analyst'
const jobLocation = 'Melbourne'

async function run() {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
        await page.goto(constants.SEEK_URL);
        await page.click(constants.KEYWORDS);
        await page.keyboard.type(jobTitle);
        await page.click(constants.LOCATION);
        await page.keyboard.type(jobLocation);
        await page.click(constants.SEARCH);
        await page.waitFor(2000);
    
    const testSelector = 'div._365Hwu1 > article:nth-child(2) > div._1mzsMx5 > span.K1Fdmkw > span > span > strong > span > span'
    let test = await page.evaluate( sel => {
        let test = document.querySelector(sel)
        return test.innerText
    }, testSelector)
    console.log(test)

    await browser.close()
}

run()
