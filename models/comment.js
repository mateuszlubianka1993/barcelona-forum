const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	commentBody: {
		type: String,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	newsId: {
		type: Schema.Types.ObjectId,
		ref: 'News',
		required: true
	}
});

module.exports = mongoose.model('Comment', commentSchema);
