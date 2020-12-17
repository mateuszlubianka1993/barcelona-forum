const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
	auth: {
		api_key: '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'
	}
}));

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login Page',
		errorMessage: req.flash('errorMessage')
	});
};

exports.postLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({email: email})
		.then(user => {
			if(!user) {
				req.flash('errorMessage', 'Wrong email or password');
				return res.redirect('login');
			}
			bcrypt.compare(password, user.password)
				.then(correct => {
					if(correct) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							console.log(err);
							res.redirect('/');
						});
					}
					req.flash('errorMessage', 'Wrong email or password');
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/login');
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postLogout = (req, res) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};

exports.getSignUp = (req, res) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup Page',
		signupEmailError: req.flash('signupEmailError')
	});
};

exports.postSignUp = (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	// const confirmPassword = req.body.confirmPassword;

	User.findOne({email: email})
		.then(user => {
			if(user) {
				req.flash('signupEmailError', 'This email address already exists, please select another one.');
				return res.redirect('/signup');
			}
			return bcrypt.hash(password, 12).then(hashedPass => {
				const newUser = new User({
					username: username,
					email: email,
					password: hashedPass,
					favouriteNews: {items: []}
				});
				return newUser.save();
			})
				.then(() => {
					res.redirect('/login');
					return transporter.sendMail({
						to: email,
						from: 'lubiankamateusz@gmail.com',
						subject: 'Successful registration.',
						html: '<h1>Your account on the Barcelona Forum portal has been created!</h1>'
					})
						.catch(err => {
							console.log(err);
						});
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getChangePassword = (req, res) => {
	res.render('auth/change-password', {
		path: '/change-password',
		pageTitle: 'Change password Page',
		errorMessage: req.flash('errorMessage')
	});
};

exports.postChangePassword = (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if(err) {
			console.log(err);
			return res.redirect('/change-password');
		}
		const token = buffer.toString('hex');
		const email = req.body.email;
		User.findOne({email: email})
			.then(user => {
				if(!user) {
					req.flash('errorMessage', 'User with this email address not found.');
					return res.redirect('/change-password');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then(() => {
				res.redirect('/');
				transporter.sendMail({
					to: email,
					from: 'lubiankamateusz@gmail.com',
					subject: 'Change password.',
					html: `
					<h1>Change password.</h1>
					<p>We received a request to change the password.</p>
					<p>To change your password, click on this <a href="http://localhost:3000/change-password/${token}">link</a>.</p>
				`
				});
			})
			.catch(err => {
				console.log(err);
			});
	});
};

exports.getNewPassword = (req, res) => {
	const token = req.params.token;
	User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
		.then(user => {
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New password Page',
				errorMessage: req.flash('errorMessage'),
				userId: user._id.toString(),
				passwordToken: token
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postNewPassword = (req, res) => {
	const userId = req.body.userId;
	const password = req.body.password;
	const token = req.body.passwordToken;
	let updatedUser;
	User.findOne({_id: userId, resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
		.then(user => {
			updatedUser = user;
			return bcrypt.hash(password, 12);
		})
		.then(hashedPass => {
			updatedUser.password = hashedPass;
			updatedUser.resetToken = undefined;
			updatedUser.resetTokenExpiration = undefined;
			return updatedUser.save();
		})
		.then(() => {
			res.redirect('/login');
		})
		.catch(err => {
			console.log(err);
		});
};
