// The ORM
const mongoose = require('mongoose');
// THe passwords hasher
const bcrypt = require('bcrypt');
// The JSON Web Token generator
const jwt = require('jsonwebtoken');
// The model
const User = require('../models/user');

// User log in process, validates exist and credentials are correct
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    // Get the token
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_PRIVATE_KEY,
                        {
                            expiresIn: process.env.JWT_EXPIRES
                        }
                    );
                    // Expiration format https://github.com/zeit/ms
                    // All good, return token and 200 status code
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
