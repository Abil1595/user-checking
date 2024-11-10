const User=require('../models/userModel')
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.registerUser = async (req, res, next) => {
    const { name, email, password, rewards, privacy, Dateofbirth } = req.body;

    // Log to check if Dateofbirth is being passed correctly
    console.log("Received Dateofbirth:", Dateofbirth);

    // Validate if rewards and privacy are true
    if (rewards === false) {
        return res.status(400).json({
            success: false,
            message: "Rewards setting must be true."
        });
    }

    if (privacy === false) {
        return res.status(400).json({
            success: false,
            message: "Privacy setting must be true."
        });
    }

    try {
        // Convert Dateofbirth to a Date object
        let parsedDateOfBirth = null;
        if (Dateofbirth) {
            // Try parsing the Dateofbirth to a Date object
            parsedDateOfBirth = new Date(Dateofbirth);
            
            // If the parsed date is invalid, return an error
            if (isNaN(parsedDateOfBirth.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Dateofbirth format"
                });
            }
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            rewards,
            privacy,
            Dateofbirth: parsedDateOfBirth, // Save parsed date
        });

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error); // Log any unexpected errors
        next(error); // Pass error to global error handler
    }
};



exports.loginUser = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next("Please enter email", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next("Invalid email", 400);
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store the OTP and expiry time in the user document temporarily (you may want a different way to manage OTPs in production)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP to user's email
    const message = `Your OTP for login is ${otp}. This OTP will expire in 10 minutes.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Login OTP",
            message,
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return next("Failed to send OTP email", 500);
    }
};

// Endpoint to verify OTP
exports.verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next("Please enter email and OTP", 400);
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        return next("Invalid or expired OTP", 400);
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "OTP verified, login successful",
        user
    });
};
exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
         success: true,
         users
    })
 }