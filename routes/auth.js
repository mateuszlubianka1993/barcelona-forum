const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignUp);
router.post('/signup', 
	[
		check('email').isEmail().withMessage('Incorrect e-mail. Enter the correct one.'),
		body('password', 'Please enter a password of at least 8 characters.').isLength({min: 8}),
		body('confirmPassword').custom((value, {req}) => {
			if(value !== req.body.password) {
				throw Error('Passwords must match.');
			}
			return true;
		})
	], authController.postSignUp);
router.get('/change-password', authController.getChangePassword);
router.post('/change-password', authController.postChangePassword);
router.get('/change-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;