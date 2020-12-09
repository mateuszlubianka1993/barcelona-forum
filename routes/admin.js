const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const news = [];

router.get('/add-news', (req, res, next) => {

    res.render('add-news', {
        pageTitle: 'Forum Add News Page',
        path: '/admin/add-news',
    });
});

router.post('/add-news', (req, res, next) => {

    news.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.news = news;
