const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    home: Object
}, {minimize: false })

module.exports = mongoose.model('User', schema);