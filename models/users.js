var mongoose = require('mongoose');

var User = new mongoose.Schema({
    twitter: {
        id: String,
        userName: String,
        displayName: String
    }
})

module.exports = mongoose.model('users', User)