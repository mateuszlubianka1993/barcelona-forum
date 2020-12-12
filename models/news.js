const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class News  {
    constructor(title, imageUrl, description, content, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.content = content;
        this._id = id;
    } 

    save() {
        const db = getDb();
        let databaseAction;
        if(this._id) {
            databaseAction = db.collection('newsList').updateOne({
                _id: new mongodb.ObjectID(this._id)
            }, {
                $set: this
            })
        } else {
            databaseAction = db.collection('newsList').insertOne(this);
        }
        return databaseAction.then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('newsList').find().toArray().then(newsList => {
            return newsList;
        }).catch(err => {
            console.log(err);
        });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('newsList').find({_id: new mongodb.ObjectID(id)}).next()
        .then(newsItem => {
            return newsItem;
        })
        .catch(err => {
            console.log(err);
        })      
    }

    static deleteByID(id) {
        const db = getDb();
        return db.collection('newsList').deleteOne({_id: new mongodb.ObjectID(id)})
        .then(newsItem => {
            console.log('Item deleted');
        })
        .catch(err => {
            console.log(err);
        })      
    }
}

module.exports = News;
