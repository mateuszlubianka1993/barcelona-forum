const isPermit = (roles) => {
	return (req, res, next) => {
		const userRole = req.user.role;
		const result = roles.filter(role => {
			return userRole === role;
		});
		if(result.length < 1) {
			return res.redirect('/login');
		}
		
		next();
	};
};

module.exports = {isPermit};
