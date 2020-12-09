const path = require('path');

const express = require('express');

const newsController = require('../controllers/news');

const router = express.Router();

router.get('/add-news', newsController.getAddNews);

router.post('/add-news', newsController.postAddNews);

module.exports = router;
