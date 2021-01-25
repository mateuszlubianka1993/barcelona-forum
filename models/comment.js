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
	points: {
		type: Number,
		required: true,
		default: 0
	},
	ratedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }]
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

commentSchema.methods.updateCommentPoints = function(mode) {
	if(mode === 'add') {
		this.points++;
	} else if(mode === 'subtract') {
		this.points--;
	}
	return this.save();
};

commentSchema.methods.updateRatedBy = function(userId) {
	const updatedItems = [...this.ratedBy];
	updatedItems.push(userId);

	this.ratedBy = updatedItems;
	return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);
