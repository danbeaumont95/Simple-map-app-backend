const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Session = require('../models/Session');
require('dotenv').config();
const { uniqueId } = require('lodash');

const generateAccessToken = (user) => jwt.sign(
    {
        exp: Math.floor(Date.now() / 1000) + (6 * (60 * 60)),
        data: {
            id: user._id,
            username: user.username,
            email: user.email
        },
    },
    process.env.TOKEN_SECRET,
);

exports.refreshToken = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
       const findSession = await Session.findOne({ sessionToken: token });
       if (findSession) {
           const user = await User.findById(findSession.userId);
           const newToken = generateAccessToken(user);
           await Session.findByIdAndDelete(findSession._id);
           return res.status(200).json({ newToken })
       }
       return res.status(500).json({ error: 'Cant_find' })
    } catch (ex) {
        res.status(401).json('Session Issue');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Username does not exist');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Password is incorrect');
        const token = generateAccessToken(user);
        const session = new Session({
            _id: mongoose.Types.ObjectId(),
            userId: user._id,
            sessionToken: token
        });
        await session.save();
        const userData = {
            user, session
        };
        return res.status(200).json({ ...userData })
    } catch (error) {
        console.log(error, 'error');
        res.send({ error: `${error.message}` })
    }
};

const createUser = async (username, password, email, firstName, lastName) => {
    const home = {};
    try {
        const emailFound = await User.findOne({ email });
        if (emailFound) return new Error('Email already exists');
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            username,
            password: bcrypt.hashSync(password, 10),
            email,
            firstName,
            lastName,
            home,
        });
        console.log(user, 'user before save')
        await user.save();
        // const msg = {
        //     to: email,
        //     from: 'danibeamo@hotmail.com',
        //     subject: 'Thanks for signing up',
        //     html: `
        //     <br />You have successfully signed up to my website.
        //     <br />Please click "log in" and enter the following details
        //     <br />Username: ${email}
        //     <br />Password: ${password}
        //     <br />Thank you!`
        // };
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // sgMail
        //     .send(msg)
        //     .then(() => {
        //         console.log('Email sent')
        //     })
        //     .catch((error) => {
        //         console.error(error.response.body)
        //     });
            console.log(user, 'user after email')
            return user;
    } catch (error) {
        console.log(error, 'error');
        return new Error(error)
    }
};

exports.createUser = async (username, password, email, firstName, lastName) => createUser(username, password, email, firstName, lastName);

exports.register = async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    try {
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(200).json({ error: 'User found', msg: 'This email already exists' });
        const user = await createUser(username, password, email, firstName, lastName);
        console.log('registered');
        // const ourMessage = {
        //     to: 'danielbeaumont95@hotmail.co.uk',
        //     from: 'danibeamo@hotmail.com',
        //     subject: 'An account has been registered',
        //     html: `New user registered!
        //     <br />Username: ${username}
        //     <br />Email: ${email},`
        // };
        // sgMail
        //     .send(ourMessage)
        //     .then(() => {
        //         console.log('Email sent');
        //     })
        //     .catch((error) => {
        //         console.error(error.response.body);
        //     });
            return res.status(200).json({
                msg: `User ${email} from ${user} has successfully been registered \n`,
                user
            });
    } catch (error) {
        res.send({ error: `${error.message}` })
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users.length) return res.status(400).json({ msg: 'No users found' });
        return res.status(200).json(users)
    } catch (error) {
        res.send({ error: `${error.message}` })
    }
};

exports.getUsernameFromEmail = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email, 'email from req body')
        const user = await User.findOne({ email }, ['username']);
        if (!user) return res.status(404).json({ msg: 'No user found with that email' })
        return res.status(200).json(user);
    } catch (error) {
        res.send({ error: `${error.message}` })
    }
}