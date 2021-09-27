const express = require('express');
const cors = require('cors');
const userController = require('../controllers/users.controller');
require('dotenv').config();

const router = express.Router();
router.options('/login', cors());

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/getallusers', userController.getAllUsers);
router.post('/getusernamefromemail', userController.getUsernameFromEmail);

module.exports = router;