const express = require('express')
const router = express.Router();
const authController = require('../controllers/AuthController')


router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/refreshToken',authController.refreshToken)
router.get('/verifyEmail/:otp',authController.verifyEmail)
router.post('/sendConfirmationMail',authController.sendConfirmationMail)


module.exports = router