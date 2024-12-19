const { response } = require('express')
const Register = require('../models/AuthModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const register = (req, res, next) => {

    if (!req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone) {
        return res.status(400).json({
            error: 'Please filled all required fields'
        });
    }

    bcrypt.hash(req.body.password, 10, function (err, hashPass) {
        if (err) {
            res.json({
                error: err
            })
        }
        let newUser = new Register({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashPass,
        })

        newUser.save().then(response => {
            res.json({
                status: 200,
                message: 'User Register Successfully',
            });
            res.json({ status: 200, message: 'User Register Successfully' })
        }).catch(error => {
            res.json({
                status: 500,
                message: 'An Error Occurred while checking the email',
                error: error.message
            });
        })
    })


}


const login = (req, res, next) => {
    if (!req.body.password || !req.body.email) {
        return res.json({
            status:400,
            error: 'Please filled all required fields'
        });
    }
    let userMail = req.body.email;

    Register.findOne({ $or: [{ email: userMail }, { phone: userMail }] }).then(response => {
        if (response) {

            bcrypt.compare(req.body.password, response.password, function (err, result) {
                if (err) {
                    res.json({
                        error: err,
                        status: 200,
                        message: 'An Error Occured'
                    })
                }
                if (result) {
                    let token = jwt.sign({ name: response.firstName }, 'verySecretValue', { expiresIn: '1h' });
                    res.json({
                        status: 200,
                        message: 'User Login Successfull',
                        token
                    })
                }
                else {
                    res.json({
                        error: err,
                        status: 200,
                        message: 'Password is Incorrect'
                    })
                }
            })
        } else {
            res.json({
                status: 200,
                message: "Email doesn't exists",
            });
        }

    }).catch(error => {
        res.json({
            status: 500,
            message: "An Error Occured",
            error: error.message
        });
    })



}

module.exports = { register, login }