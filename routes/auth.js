const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);
router.get('/change-password', authController.getChangePassword);
router.post('/change-password', authController.postChangePassword);
router.get('/change-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;