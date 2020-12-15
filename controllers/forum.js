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

exports.postFavouriteNews = (req, res, next) => {
    const newsId = req.body.newsId;
    News.findById(newsId)
    .then(newsItem => {
        return req.user.addNewsToFavourites(newsItem);
    })
    .then(() => {
        res.redirect('/user/favourite-news-list');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getFavouriteNewsList = (req, res, next) => {
    req.user.getFavouriteNewsList()
    .then(items => {
        res.render('forum/favouriteNewsList', {
            path: '/user/favourite-news-list',
            pageTitle: 'Favourite News List',
            newsItems: items
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postDeleteFavouriteItem = (req, res, next) => {
    const newsId = req.body.newsId;
    req.user.deleteFavouriteItem(newsId)
    .then(result => {
        res.redirect('/user/favourite-news-list');
    })
    .catch(err => {
        console.log(err);
    });
}
