const mongoose = require('mongoose');

let jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    description: String,
    category: String,
    period: String,
    dateCrawled: Date
});

let Job = mongoose.model('Job', jobSchema);

module.exports = Job;