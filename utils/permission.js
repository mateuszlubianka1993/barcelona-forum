const isPermit = (role) => {
	return (req, res, next) => {
		const userRole = req.user.role;
		if(userRole !== role) {
			return res.redirect('/login');
		}
		// Remove after tests
		console.log(role);
		next();
	};
};

module.exports = {isPermit};
