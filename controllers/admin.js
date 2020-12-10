const News = require('../models/news');

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

    const singleNews = new News(null, title, imageUrl, description, content);
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

exports.getEditNews = (req, res, next) => {
    const edit = req.query.edit;
    if(!edit) {
        return res.redirect('/');
    }
    
    const newsId = req.params.newsId;
    News.findById(newsId, newsItem => {
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
    
    const updatedNews = new News(newsId, updatedTitle, updatedImageUrl, updatedDescription, updatedContent);
    updatedNews.save();

    res.redirect('/admin/news-list');
}

exports.postDeleteNews = (req, res, next) => {
    const newsId = req.body.newsId;
    News.deleteByID(newsId);

    res.redirect('/admin/news-list');
}
