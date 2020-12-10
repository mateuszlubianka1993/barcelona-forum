const News = require('../models/news');

exports.getHome = (req, res, next) => {   
    News.fetchAll(news => {
        res.render('forum/home', {
            pageTitle: 'Forum Home Page',
            news: news,
            path: '/',
            hasNews: news.length > 0,
        });
    });
}

exports.getNewsList = (req, res, next) => {
    News.fetchAll(news => {
        res.render('forum/news-list', {
            pageTitle: 'Forum News List',
            news: news,
            path: '/news-list',
            hasNews: news.length > 0,
        });
    });
}

exports.getNewsItem = (req, res, next) => {
    const newsId = req.params.newsId;
    News.findById(newsId, newsItem => {
        res.render('forum/news', {
            newsItem: newsItem,
            pageTitle: 'News Page'
        });
    });
}
