const News = require('../models/news');

exports.getAddNews = (req, res, next) => {
    res.render('admin/add-news', {
        pageTitle: 'Forum Add News Page',
        path: '/admin/add-news',
    });
}

exports.postAddNews = (req, res, next) => {
    const singleNews = new News(req.body.title);
    singleNews.save();

    res.redirect('/');
}

exports.getNewsList = (req, res, next) => {
    News.fetchAll(news => {
        res.render('admin/news-list', {
            pageTitle: 'Admin News List',
            news: news,
            path: '/admin/news-list',
            hasNews: news.length > 0,
        });
    });
}
