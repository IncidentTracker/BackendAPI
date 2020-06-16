const express = require('express');
const router = express.Router();
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const loginDB = require('../Models/loginSchema');
const crypto = require('crypto');
const passwordResetToken = require('../Models/resetSchema');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "meerassiet@gmail.com",
        pass: "ihotrqdozcsbkvrt"
    }
});

router.use(cors());
router.use(bodyParser.json());


// Get inputs for the first time user of Oncall Tracker
router.post('/', async(req, res) => {
    try {
        const user = await loginDB.findOne({ email: req.body.newData.email });
        if (user) {
            res.json({
                'Success': false,
                'Error': 'Existing User'
            });
        } else {
            var signUpData = new loginDB({
                firstname: req.body.newData.firstname,
                lastname: req.body.newData.lastname,
                team: req.body.newData.team,
                email: req.body.newData.email,
                password: req.body.newData.password
            });
            signUpData.save(function(err) {
                if (err) {
                    res.json({
                        'Success': false,
                        'Error': 'Unable to register'
                    });
                } else {
                    res.json({
                        'Success': true,
                        'Error': 'Wait for the token to be sent to your email-id for verification'
                    });
                }
            });
        }
    } catch (err) {
        res.json({
            'Success': false,
            'Error': err
        });
    }
});


// Create an One Time Use token for email-id verification
router.post('/generateOTP', async(req, res) => {
    try {
        const user = await loginDB.findOne({ email: req.body.emailData });

        if (!user) {
            res.json({
                'Success': false,
                'Error': 'Not a registered user'
            });
        } else {
            var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
            resettoken.save(function(err) {
                if (err) {
                    res.json({
                        'Success': false,
                        'Error': 'Token error'
                    });
                }
                passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
                let mailOptions = {
                    to: user.email,
                    from: 'Meera',
                    subject: 'Oncall Tracker Registration- Verification Token',
                    text: 'Hello ' + user.firstname + '\nYou are receiving this because you (or someone else) have requested to register for Mphasis Oncall Tracker.\n\n' +
                        'Please use the below token to complete the registration process:\n\n' +
                        resettoken.resettoken + '\n\n' +
                        'Please ignore this email if you did not request this.\n'
                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.json({
                            'Success': false,
                            'Error': err
                        });
                    } else {
                        res.json({
                            'Success': true,
                            'Error': 'Token has been sent to the registered email-id'
                        });
                    }
                })
            })
        }

    } catch (err) {
        res.json({
            'Success': false,
            'Error': err
        });
    }
});


// Validate the One Time Use token for email-id verification
router.post('/validateOTP', async(req, res) => {
    try {
        passwordResetToken.findOne({ resettoken: req.body.resettoken }, function(err, userToken, next) {
            if (!userToken) {
                res.json({
                    'Success': false,
                    'Error': 'Token expired or invalid'
                });
            } else {
                loginDB.findOne({ _id: userToken._userId }, function(err, userDetails, next) {
                    if (userDetails.email == req.body.email) {
                        userDetails.token = req.body.resettoken;
                        userDetails.save(function(err) {
                            if (err) {
                                res.json({
                                    'Success': false,
                                    'Error': 'err'
                                });
                            } else {
                                userToken.remove();
                                res.json({
                                    'Success': true,
                                    'Error': 'Registration successful'
                                });
                            }
                        });
                    } else {
                        res.json({
                            'Success': false,
                            'Error': 'invalid email-id'
                        });
                    }
                });
            }
        })
    } catch (err) {
        res.json({
            'Success': false,
            'Error': err
        });
    }
});


// Create an One Time Use token for password reset
router.post('/resetPassword', async(req, res) => {
    try {
        const user = await loginDB.findOne({ email: req.body.emailData });

        if (!user) {
            res.json({
                'Success': false,
                'Error': 'Not a registered user'
            });
        } else {
            var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
            resettoken.save(function(err) {
                if (err) {
                    res.json({
                        'Success': false,
                        'Error': 'Token error'
                    });
                }
                passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
                let mailOptions = {
                    to: user.email,
                    from: 'Meera',
                    subject: 'Oncall Tracker Password Reset',
                    text: 'Hello ' + user.firstname + '\nYou are receiving this because you (or someone else) have requested the reset of the password for your Mphasis Oncall Tracker account.\n\n' +
                        'Please use the below token to reset your password:\n\n' +
                        resettoken.resettoken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.json({
                            'Success': false,
                            'Error': err
                        });
                    } else {
                        res.json({
                            'Success': true,
                            'Error': 'Token has been sent to the registered email-id'
                        });
                    }
                })
            })
        }

    } catch (err) {
        res.json({
            'Success': false,
            'Error': err
        });
    }
});


// Validate the One Time Use token for password reset
router.post('/validateResetOTP', async(req, res) => {
    try {
        passwordResetToken.findOne({ resettoken: req.body.resettoken }, function(err, userToken, next) {
            if (!userToken) {
                res.json({
                    'Success': false,
                    'Error': 'Token expired or invalid'
                });
            } else {
                loginDB.findOne({ _id: userToken._userId }, function(err, userDetails, next) {
                    if (userDetails.email == req.body.email) {
                        userDetails.password = req.body.password;
                        userDetails.save(function(err) {
                            if (err) {
                                res.json({
                                    'Success': false,
                                    'Error': 'Password can not be reset'
                                });
                            } else {
                                res.json({
                                    'Success': true,
                                    'Error': 'Password reset successful'
                                });
                            }
                        });
                    } else {
                        res.json({
                            'Success': false,
                            'Error': 'invalid email-id'
                        });
                    }
                });
            }
        })
    } catch (err) {
        res.json({
            'Success': false,
            'Error': err
        });
    }
});

module.exports = router;