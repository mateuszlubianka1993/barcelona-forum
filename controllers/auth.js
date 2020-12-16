const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login Page',
		isAuth: false
	});
};

exports.postLogin = (req, res) => {
	User.findById('5fd8cf32f5f4be1100bf7ef9')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				console.log(err);
				res.redirect('/');
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
		isAuth: false
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
				});
		})
		.catch(err => {
			console.log(err);
		});
};
