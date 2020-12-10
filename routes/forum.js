const path = require('path');

const express = require('express');

const forumController = require('../controllers/forum');

const router = express.Router();

router.get('/', forumController.getHome);
router.get('/news-list', forumController.getNewsList);

module.exports = router;