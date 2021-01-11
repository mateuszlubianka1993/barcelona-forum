const fs = require('fs');

const deleteFile = (path) => {
	fs.unlink(path, err => {
		if(err) {
			throw err;
		}
	});
};

module.exports = deleteFile;
