const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const news = adminData.news;
    console.log(news);
    res.render('home', {
        pageTitle: 'Forum Home Page',
        news: news,
        path: '/',
        hasNews: news.length > 0,
    });
});

module.exports = router;