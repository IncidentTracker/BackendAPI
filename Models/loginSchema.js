const mongoose = require('mongoose');

const loginSchema = mongoose.Schema({
    'firstname': String,
    'lastname': String,
    'team': String,
    'email': String,
    'password': String,
    'token': String
});

module.exports = mongoose.model('login', loginSchema);