const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const rootDir = require('../utils/path');''

const p = path.join(rootDir, 'data', 'news.json');

const getItemsFromFile = (callback) => {
    fs.readFile(p, (err, data) => {
        if(err) {
            callback([]);
        } else {
            callback(JSON.parse(data));
        }
    });
}

module.exports = class News {
    constructor(title, imageUrl, description, content) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.content = content;
    }

    save() {
        this.id = uuidv4().toString();

        getItemsFromFile(news => {
            news.push(this);
            fs.writeFile(p, JSON.stringify(news), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getItemsFromFile(callback);
    }

    static findById(id, callback) {
        getItemsFromFile(news => {
            const newsItem = news.find(item => item.id === id);
            callback(newsItem);
        });
    }
}