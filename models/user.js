const mongoose = require('mongoose');

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
	favouriteNews: {
		items: [{
			newsId: {
				type: Schema.Types.ObjectId,
				ref: 'News', 
				required: true
			}
		}]
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

module.exports = mongoose.model('User', userSchema);
