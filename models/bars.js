var mongoose = require('mongoose');

var Bars = new mongoose.Schema({
    id: String,
    peopleGoing: String,
})

module.exports = mongoose.model('bars', Bars)