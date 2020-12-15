const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

const ObjectId = mongodb.ObjectID;

class User {
    constructor(username, email, favouriteNews, id) {
        this.username = username;
        this.email = email;
        this.favouriteNews = favouriteNews;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addNewsToFavourites(news) {
        // const favouriteNewsItem = this.favouriteNews.items.finIndex(item => {
        //     return item.newsId === news._id.toString();
        // });
        // if(favouriteNewsItem.length > 0) {
        //     return;
        // }
        const favouriteNews = this.favouriteNews && this.favouriteNews.items;
        let updatedFavouritesItems = [];
        if(!favouriteNews) {
            updatedFavouritesItems.push({
                newsId: new ObjectId(news._id)
            });
        } else {
            updatedFavouritesItems = [...this.favouriteNews.items];
            updatedFavouritesItems.push({
                newsId: new ObjectId(news._id)
            });
        }
        
        const updatedFavourites = {
            items: updatedFavouritesItems
        };
        const db = getDb();
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)}, 
            {$set: {favouriteNews: updatedFavourites}});
    }

    getFavouriteNewsList() {
        const db = getDb();
        const newsIds = this.favouriteNews.items.map(item => {
            return item.newsId;
        });
        return db.collection('newsList')
        .find({_id: {$in: newsIds}})
        .toArray()
        .then(items => {
            return items;
        })
    }

    deleteFavouriteItem(itemId) {
        const updatedItems = this.favouriteNews.items.filter(item => {
            return item.newsId.toString() !== itemId.toString();
        });
        const db = getDb();
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)}, 
            {$set: {favouriteNews: {items: updatedItems}}});
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: new ObjectId(id)});
    }
}

module.exports = User;
