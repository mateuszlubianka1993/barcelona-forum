const News = require('../models/news');

exports.getHome = (req, res, next) => {   
    News.fetchAll().then(news => {
        res.render('forum/home', {
            pageTitle: 'Forum Home Page',
            news: news,
            path: '/',
            hasNews: news.length > 0,
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getNewsList = (req, res, next) => {
    News.fetchAll().then(news => {
        res.render('forum/news-list', {
            pageTitle: 'Forum News List',
            news: news,
            path: '/news-list',
            hasNews: news.length > 0,
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getNewsItem = (req, res, next) => {
    const newsId = req.params.newsId;
    News.findById(newsId).then(newsItem => {
        res.render('forum/news', {
            newsItem: newsItem,
            pageTitle: 'News Page',
            path: '/news-list'
        });
    });
}
