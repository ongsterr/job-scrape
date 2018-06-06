const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

const constants = require('./util/constants.js');
const Job = require('./models/job');

const jobTitle = 'Junior Developer'
const jobLocation = 'Melbourne'
const jobTitleLink = jobTitle.toLowerCase().split(' ').join('-')
const searchUrl = `https://www.seek.com.au/${jobTitleLink}-jobs/in-${jobLocation}`

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

    let numPages = await getNumPages(page);
    console.log('Numpages: ', numPages);

    for (let h = 1; h <= numPages; h++) {
        let pageUrl = h > 1 ? searchUrl + '?page=' + h : searchUrl;
        await page.goto(pageUrl);
        console.log(`Page ` + h)

        const listContainer = constants.JOB_CLASS;
        let jobListLength = await page.evaluate(sel => {
            let jobList = document.querySelectorAll(sel);
            return jobList.length;
        }, listContainer)

        for (let i = 2; i <= jobListLength; i++) {
            let titleSelector = constants.JOB_TITLE.replace('INDEX', i);
            let detailSelector = constants.JOB_DETAILS.replace('INDEX', i);
            let categorySelector = constants.JOB_CATEGORY.replace('INDEX', i);

            let jobTitle = await page.evaluate(sel => {
                let element = document.querySelector(sel)
                return element ? element.getAttribute('aria-label') : null
            }, titleSelector)

            let jobCategory = await page.evaluate(sel => {
                let element = document.querySelector(sel)
                return element ? element.innerText.replace('classification: ', '') : null
            }, categorySelector)

            let jobCompany = await page.evaluate(sel => {
                let element = document.querySelectorAll(sel)[2]
                return element ? element.innerText.replace('at ', '') : null
            }, detailSelector)

            let jobDescription = await page.evaluate(sel => {
                let element = document.querySelectorAll(sel)[3]
                return element ? element.innerText : null
            }, detailSelector)

            let jobDays = await page.evaluate(sel => {
                let element = document.querySelectorAll(sel)[1]
                return element ? element.innerText : null
            }, detailSelector)

            console.log(jobTitle + '->' + jobCategory + '->' + jobCompany + '->' + jobDays)

            await insertJob({
                title: jobTitle,
                company: jobCompany,
                description: jobDescription,
                category: jobCategory,
                period: jobDays,
                dateCrawled: new Date()
            })
        }
    }
    
    await browser.close()
}

run()

async function getNumPages(page) {
    const jobCount = constants.JOBS_NUM;

    let pageCount = await page.evaluate( sel => {
        let jobs = parseInt(document.querySelector(sel).innerText);
        let pages = Math.ceil(jobs / 20);
        return pages
    }, jobCount)

    return pageCount
}

async function insertJob(jobPost) {
    const DB_URL = 'mongodb://localhost/joblist'
    const connection = mongoose.connection

    if (connection.readyState === 0) {
        await mongoose.connect(DB_URL);
    }

    connection.on('connected', () => {
        console.log('Establish connection to MongoDB')
    })

    // if a job entry exists, update the entry, don't insert
    let conditions = {
        period: jobPost.period
    }

    let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };

    Job.findOneAndUpdate(conditions, jobPost, options, (err, result) => {
        if (err) throw err;
        console.log('Job posted.')
    });
}