exports.getLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login Page',
		isAuth: false
	});
};

exports.postLogin = (req, res) => {
	req.session.isLoggedIn = true;
	res.redirect('/');
};
