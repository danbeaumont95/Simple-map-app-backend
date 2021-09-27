const express = require('express');
const pinController = require('../controllers/pin.controller');
const router = express.Router();

router.get('/', pinController.getAllPins);
router.post('/', pinController.createNewPin);

module.exports = router;