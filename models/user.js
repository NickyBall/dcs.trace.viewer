const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema

const User = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);