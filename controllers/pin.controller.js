
const Pin = require('../models/Pin');

exports.createNewPin = async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        return res.status(200).json(savedPin)
    } catch (error) {
        res.send({ error: `${error.message}` })
    }
};

exports.getAllPins = async (req, res) => {
    try {
        const pins = await Pin.find();
        if (!pins.length) return res.status(400).json({ msg: 'No pins found' });
        return res.status(200).json(pins)
    } catch (error) {
        res.send({ error: `${error.message}` })
    }
}