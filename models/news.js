const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

module.exports = mongoose.model('News', newsSchema);
