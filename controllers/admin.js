const mongodb = require('mongodb');
const News = require('../models/news');
const objectId = mongodb.ObjectID;

exports.getAddNews = (req, res, next) => {
    res.render('admin/edit-news', {
        pageTitle: 'Forum Add News Page',
        path: '/admin/add-news',
        editing: false
    });
}

exports.postAddNews = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const content = req.body.content;

    const singleNews = new News(title, imageUrl, description, content, null, req.user._id);
    singleNews.save().then(result => {
        console.log('Created news');
        res.redirect('/admin/news-list');
    }).catch(err => {
        console.log(err);
    });
}

exports.getNewsList = (req, res, next) => {
    News.fetchAll().then(news => {
        res.render('admin/news-list', {
            pageTitle: 'Admin News List',
            news: news,
            path: '/admin/news-list',
            hasNews: news.length > 0,
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getEditNews = (req, res, next) => {
    const edit = req.query.edit;
    if(!edit) {
        return res.redirect('/');
    }
    
    const newsId = req.params.newsId;
    News.findById(newsId).then(newsItem => {
        if(!newsItem) {
            return res.redirect('/');
        }

        res.render('admin/edit-news', {
            pageTitle: 'Forum Edit News Page',
            path: '/admin/edit-news',
            editing: edit,
            newsItem: newsItem
        });
    });
}

exports.postEditNews = (req, res, next) => {
    const newsId = req.body.newsId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedContent = req.body.content;
    
    const updatedNews = new News(updatedTitle, updatedImageUrl, updatedDescription, updatedContent, new objectId(newsId));
    updatedNews.save().then(result => {
        res.redirect('/admin/news-list');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postDeleteNews = (req, res, next) => {
    const newsId = req.body.newsId;
    News.deleteByID(newsId).then(() => {
        res.redirect('/admin/news-list');
    })
    .catch(err => {
        console.log(err);
    });
}
