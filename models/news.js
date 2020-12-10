const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');''

module.exports = class News {
    constructor(title, imageUrl, description, content) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.content = content;
    }

    save() {
        const p = path.join(rootDir, 'data', 'news.json');
        fs.readFile(p, (err, data) => {
            let news = [];
            if(!err) {
                news = JSON.parse(data);
            }
            news.push(this);
            fs.writeFile(p, JSON.stringify(news), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        const p = path.join(rootDir, 'data', 'news.json');
        fs.readFile(p, (err, data) => {
            if(err) {
                callback([]);
            }
            callback(JSON.parse(data));
        });
    }
}