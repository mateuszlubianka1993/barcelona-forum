const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-news', adminController.getAddNews);
router.post('/add-news', adminController.postAddNews);
router.get('/news-list', adminController.getNewsList);

module.exports = router;
