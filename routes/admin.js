const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

router.get('/add-news', (req, res, next) => {

    res.sendFile(path.join(rootDir, 'views', 'add-news.html'));
});

router.post('/add-news', (req, res, next) => {

    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
