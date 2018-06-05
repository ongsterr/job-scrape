const puppeteer = require('puppeteer');
const fs = require('fs');
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
        await page.screenshot({ path: './src/screenshots/search.png' });

        const listContainer = constants.JOB_CLASS;
        let jobListLength = await page.evaluate( sel => {
            let jobList = document.querySelectorAll(sel);
            return jobList.length;
        }, listContainer)

        for (let i = 2; i <= jobListLength; i++ ) {
            let titleElement = constants.JOB_TITLE.replace('INDEX', i);
            let companyElement = constants.JOB_COMPANY.replace('INDEX', i);
            let daysElement = constants.DAYS_AGO.replace('INDEX', i);
            let descElement = constants.JOB_DESC.replace('INDEX', i);

            let jobTitle = await page.evaluate( sel => {
                let element = document.querySelector(sel)
                return element ? element.getAttribute('aria-label') : null
            }, titleElement)

            let jobCompany = await page.evaluate(sel => {
                let element = document.querySelector(sel)
                return element ? element.innerText : null
            }, companyElement)

            let jobDescription = await page.evaluate(sel => {
                let element = document.querySelector(sel)
                return element ? element.innerText : null
            }, descElement)

            let jobDays = await page.evaluate(sel => {
                let element = document.querySelector(sel)
                return element ? element.innerText : null
            }, daysElement)

            console.log(jobTitle + '->' + jobCompany + '->' + jobDescription + '->' + jobDays)
        }
    
    await browser.close()
}

run()

async function getNumPages(pages) {
    const jobCount = constants.JOBS_NUM;

    let pageCount = await page.evaluate( sel => {
        let jobs = parseInt(document.querySelector(sel).innerText);
        let pages = Math.ceil(jobs / 10);
        return pages
    }, jobCount)

    return pageCount
}