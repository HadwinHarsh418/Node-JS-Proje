const { response } = require('express')
const Register = require('../models/AuthModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Mailjet = require('node-mailjet');
const WelcomeMailFunction = require('../middleware/sendMail')

const register = (req, res, next) => {

    if (!req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone) {
        return res.status(400).json({
            error: 'Please filled all required fields'
        });
    }

    const mailjet = new Mailjet({
        apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
        apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret'
      });

    Register.findOne({ email: req.body.email.toLowerCase() }).then(response=>{
        if(response){
            res.json({
                status:200,
                message:'Email Already Exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, function (err, hashPass) {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                let newUser = new Register({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    phone: req.body.phone,
                    password: hashPass,
                    isVerified:false,
                    otp:Math.floor(100000 + Math.random() * 900000)
                })
        
                newUser.save().then(response => {
                    WelcomeMailFunction(req.body.email, req.body.firstName,`http://localhost:3000/verifyEmail/${newUser.otp}`,newUser.otp);
                    res.json({
                        status: 200,
                        message: 'User Register Successfully, Please Verify Mail Before Login ',
                    });
                }).catch(error => {
                    res.json({
                        status: 500,
                        message: 'An Error Occurred while checking the email',
                        error: error.message
                    });
                })
            })
        }
    }).catch(error=>{
        res.json({
            status:500,
            message:'An Error Occured'
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
    let userMail = req.body.email.toLowerCase();

    Register.findOne({ $or: [{ email: userMail }, { phone: userMail }] }).then(response => {
        if (response.isVerified) {

            bcrypt.compare(req.body.password, response.password, function (err, result) {
                if (err) {
                    res.json({
                        error: err,
                        status: 200,
                        message: 'An Error Occured'
                    })
                }
                if (result) {
                    let token = jwt.sign({ name: response.firstName }, process.env.ACCESS_JWT_TOKEN_KEY, { expiresIn: process.env.ACCESS_JWT_TOKEN_KEY_TIME });
                    let refresh_Token = jwt.sign({ name: response.firstName }, process.env.REFRESH_TOKEN_KEY, { expiresIn: process.env.REFRESH_TOKEN_KEY_TIME });
                    res.json({
                        status: 200,
                        message: 'User Login Successfull',
                        token,
                        refresh_Token
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
        }else if(!response.isVerified){
            res.json({
                status: 200,
                message: "Your account is not verified, Please Verify First!",
            });
        }
         else {
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


const refreshToken = (req, res, next) => {
    console.log(req.body.refreshToken);
    
    const refreshToken = req.body.refreshToken
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY,function (err,result){
        if(err){
            res.json({
                error:err,
                message:'Refresh Token not Verified'
            })
        }else{
            let token = jwt.sign({name:result.name},process.env.ACCESS_JWT_TOKEN_KEY,{ expiresIn: process.env.ACCESS_JWT_TOKEN_KEY_TIME});
            res.json({
                status:200,
                token,
                refreshToken,
                message:'Token Updated'
            })
        }
    })
}

const verifyEmail = (req, res, next) => {
    const requestedOtp = req.params.otp
    Register.findOne({otp:requestedOtp}).then(response=>{
        if(response){
            response.isVerified = true;
                response.save()
                    .then(updatedResponse => {
                        res.json({
                            status: 200,
                            message: 'Account Verified Successfully'
                        });
                    })
                    .catch(error => {
                        res.json({
                            status: 500,
                            message: 'An error occurred while saving the verification status.'
                        });
                    });
        }else{
            res.json({
                staus:200,
                message:'Wrong Otp'
            })
        }
    }).catch(error=>{
        res.json({
            status:500,
            message:'An Error Occured'
        })
    })
}

const sendConfirmationMail = (req, res, next) => {
    const requestUser = req.body.email.toLowerCase()
    Register.findOne({email:requestUser}).then(response=>{
        if(response){        
            response.otp = Math.floor(100000 + Math.random() * 900000);
            response.save()
            .then(updatedResponse => {
                        WelcomeMailFunction(req.body.email, req.body.firstName,`http://localhost:3000/verifyEmail/${response.otp}`,response.otp);
                        res.json({
                            status: 200,
                            message: 'Confirmation mail sent to your register mail'
                        });
                    })
                    .catch(error => {
                        res.json({
                            status: 500,
                            message: 'An error occurred while saving the verification status.'
                        });
                    });
        }else{
            res.json({
                status: 200,
                message: 'User Not Found'
            }); 
        }
    }).catch(error=>{
        res.json({
            status:500,
            message:'An Error Occured'
        })
    })
}



module.exports = { register, login , refreshToken,verifyEmail,sendConfirmationMail }