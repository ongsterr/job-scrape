const mongoose = require('mongoose');
const Job = require('./models/job');

mongoose.connect('mongodb://localhost/joblist', function (err) {
    if (err) throw err;
    console.log('Successfully connected');
});

async function getLocation() {

    let query1 = await Job.find().select('location')
    const distLocation = [];
    for (let i = 0; i <= (query1.length - 1); i++) {
        distLocation.push(query1[i].location);
    }
    const locationArr = uniq(distLocation);
    
    let query2 = Job.find().select('location')
    let totalCount = query1.length
    const locationObj = []
    for (let location of locationArr) {
        const filter = await query2.where({location: location})
        locationObj.push({
            city: location,
            count: filter.length,
            ratio: (filter.length/totalCount).toFixed(3)*1
        })
    }
    return locationObj
}

function uniq(a) {
    const array = a.sort().filter((item, pos, arr) => {
        return !pos || item != arr[pos - 1];
    })
    return array;
}

getLocation()
    .then( a => console.log(a) )