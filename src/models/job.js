const mongoose = require('mongoose');

let jobSchema = new mongoose.Schema({
    description: String,
    title: String,
    company: String,
    category: String,
    location: String,
    period: String,
    dateCrawled: Date
});

let Job = mongoose.model('Job', jobSchema);

module.exports = Job;