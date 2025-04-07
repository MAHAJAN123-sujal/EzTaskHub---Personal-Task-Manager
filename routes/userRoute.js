const express = require('express');
const { userLoginController, userRegisterController, userResetPasswordController, userForgotPasswordController,userVerifyOtpController, userLogoutController, getUserSummary,getMotivation } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router();

router.post('/register',userRegisterController)
router.post('/login',userLoginController)
router.post('/logout',userLogoutController)
router.post('/forgot-password',userForgotPasswordController)
router.post('/otp-verify',userVerifyOtpController)
router.post('/reset-password',userResetPasswordController)
router.get('/motivation',getMotivation)
router.get('/summary',authMiddleware,getUserSummary)

module.exports = router