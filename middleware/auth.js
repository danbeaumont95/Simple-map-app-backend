const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

module.exports = async (req, res, next) => {
    console.log(req.headers, 'req headers')
    console.log(req.headers.authorization, 'req head auth')
    const token = req.headers.authorization.split(' ')[1];
    console.log(token, 'TOKENNN')
    if (!token) return res.status(401).json({ message: 'Auth Error' });
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.data.id).lean();
        req.user = user;
        next();
    } catch (e) {
        if (e.name == 'TokenExpiredError') {
            return res.status(401).json({ error: 'EXPIRED', e });
        }
        res.status(500).json(e);
    }
};
