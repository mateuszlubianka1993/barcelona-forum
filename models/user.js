const mongoose = require('mongoose');

const {ROLE} = require('../utils/constants');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	resetToken: String,
	resetTokenExpiration: Date,
	favouriteNews: {
		items: [{
			newsId: {
				type: Schema.Types.ObjectId,
				ref: 'News', 
				required: true
			}
		}]
	},
	favouriteComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	role: {
		required: true,
		default: ROLE.USER,
		type: String
	}
});

userSchema.methods.addNewsToFavourites = function(news) {
	const favouriteNews = this.favouriteNews && this.favouriteNews.items;
	let updatedFavouritesItems = [];
	if(!favouriteNews) {
		updatedFavouritesItems.push({
			newsId: news._id
		});
	} else {
		updatedFavouritesItems = [...this.favouriteNews.items];
		updatedFavouritesItems.push({
			newsId: news._id
		});
	}
        
	const updatedFavourites = {
		items: updatedFavouritesItems
	};
        
	this.favouriteNews = updatedFavourites;
	return this.save();
};

userSchema.methods.deleteFavouriteItem = function(itemId) {
	const updatedItems = this.favouriteNews.items.filter(item => {
		return item.newsId.toString() !== itemId.toString();
	});

	this.favouriteNews.items = updatedItems;
	return this.save();
};

userSchema.methods.addToFavouriteComments = function(comment) {
	const favouriteComments = this.favouriteComments;
	let updatedFavouriteComments = [];
	if(!favouriteComments) {
		updatedFavouriteComments.push(comment._id);
	} else {
		updatedFavouriteComments = [...this.favouriteNews.items];
		updatedFavouriteComments.push(comment._id);
	}
        
	this.favouriteComments = updatedFavouriteComments;

	return this.save();
};

module.exports = mongoose.model('User', userSchema);
