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
    constructor(id, title, imageUrl, description, content) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.content = content;
    }

    save() {

        getItemsFromFile(news => {
            if(this.id) {
                const newsItemIndex = news.findIndex(item => item.id === this.id);
                const newNewsList = [...news];
                newNewsList[newsItemIndex] = this;
                fs.writeFile(p, JSON.stringify(newNewsList), err => {
                    console.log(err);
                });
            } else {
                this.id = uuidv4().toString();
                news.push(this);
                fs.writeFile(p, JSON.stringify(news), err => {
                    console.log(err);
                });
            }
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