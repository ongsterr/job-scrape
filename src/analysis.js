/* Questions
Where in Australia can i find junior/grad dev opportunities?
What are the top companies hiring at the moment?
What are some key skills required by hiring company?
*/

const mongoose = require('mongoose');
const Job = require('./models/job');

mongoose.connect('mongodb://localhost/joblist', function (err) {
    if (err) throw err;
    console.log('Successfully connected');
});

// Queries
async function getLocation() {

    let query1 = await Job.find().select('location')
    const distLocation = [];
    for (let i = 0; i <= (query1.length - 1); i++) {
        distLocation.push(query1[i].location);
    }
    const locationArr = uniq(distLocation);
    
    let query2 = Job.find().select('location');
    let totalCount = query1.length;
    const locationObj = [];
    for (let location of locationArr) {
        const filter = await query2.where({location: location});
        locationObj.push({
            city: location,
            count: filter.length,
            ratio: (filter.length/totalCount).toFixed(3)*1
        })
    }
    return locationObj
}

async function getCompanies() {

    let query1 = await Job.find().select('company');
    const distCompany = [];
    for (let i = 0; i <= (query1.length - 1); i++) {
        distCompany.push(query1[i].company);
    }
    const companyArr = uniq(distCompany);

    let query2 = Job.find().select('company');
    let totalCount = query1.length;
    const companyObj = [];
    for (let company of companyArr) {
        const filter = await query2.where({ company: company });
        const count = filter.length;
        companyObj.push({
            company: company,
            count: count,
            ratio: (count / totalCount).toFixed(3) * 1
        })
    }
    return companyObj
}

async function getSkills() {
    let query1 = await Job.find().select('type');
    let skillsNestArr = [];
    for (let query of query1) {
        skillsNestArr.push(query.type);
    }

    let skillsArr = skillsNestArr.reduce((a, b) => a.concat(b), []);
    let distSkills = uniq(skillsArr);

    let totalCount = query1.length
    const skillsObj = [];
    for (let skill of distSkills) {
        const count = skillsArr.filter(type => type === skill).length
        skillsObj.push({
            skill: skill,
            count: count,
            ratio: (count/totalCount).toFixed(3) * 1
        })
    }
    return skillsObj
}

// Supporting functions
function uniq(a) {
    const array = a.sort().filter((item, pos, arr) => {
        return !pos || item != arr[pos - 1];
    })
    return array;
}

// Query Execution
getLocation()
    .then( a => console.log(a) )

getCompanies()
    .then(a => console.log(a))

getSkills()
    .then(a => console.log(a))