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
	},
	author: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	likedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
});

commentSchema.methods.updateComment = function(itemId, userId) {
	const updatedItems = [...this.likedBy];
	updatedItems.push(userId);

	this.likedBy = updatedItems;
	return this.save();
};

commentSchema.methods.updateCommentDelete = function(userId) {
	const updatedItems = this.likedBy.filter(item => {
		return item._id.toString() !== userId._id.toString();
	});

	this.likedBy = updatedItems;
	return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);
