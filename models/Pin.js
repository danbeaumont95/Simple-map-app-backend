const mongoose = require('mongoose');
const User = require('./User');

const schema = mongoose.Schema({
    // _id: mongoose.Types.ObjectId,
    username: {
        // type: mongoose.Types.ObjectId,
        type: String,
        ref: User
    },
    title: {
        type: String,
        required: true,
        min: 3,
        max: 60
    },
    desc: {
        type: String,
        required: true,
        min: 3
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    long: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    }
}, {minimize: false, timestamps: true })

module.exports = mongoose.model('Pin', schema);