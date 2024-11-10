const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    rewards: {
        type: Boolean,
        required: [true, 'rewards setting is required'],
    },
    privacy: {
        type: Boolean,
        required: [true, 'Privacy setting is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Dateofbirth: {
        type: Date,  // Ensure it's a Date field
        default: null // Default to null if not provided
    }
    
});

let model = mongoose.model('NewUser', userSchema);
module.exports = model;
