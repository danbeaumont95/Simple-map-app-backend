const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const uri = `${process.env.MONGO_URI}`
const port = (process.env.PORT || 3001);
const usersRouter = require('./router/users');
const pinsRouter = require('./router/pin');

mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => {
        const app = express()
        app.use(express.json());
        app.use(cors());
        app.use('/api', router);
        app.options('*', cors());
        app.get('/info', async (req, res) => {
            res.send({ name: 'Map App', version: '0.0.1 BETA' })
        });
        const server = app.listen(port, () => {
            console.log(`Server has started on ${port}`)
        });
        router.use('/users', usersRouter);
        router.use('/pins', pinsRouter);
    })


