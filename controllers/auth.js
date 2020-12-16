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
