const News = require('../models/news');

exports.getAddNews = (req, res, next) => {
    res.render('add-news', {
        pageTitle: 'Forum Add News Page',
        path: '/admin/add-news',
    });
}

exports.postAddNews = (req, res, next) => {
    const singleNews = new News(req.body.title);
    singleNews.save();

    res.redirect('/');
}

exports.getHome = (req, res, next) => {   
    News.fetchAll(news => {
        res.render('home', {
            pageTitle: 'Forum Home Page',
            news: news,
            path: '/',
            hasNews: news.length > 0,
        });
    });
}
