const express = require('express');

const forumController = require('../controllers/forum');

const router = express.Router();

router.get('/', forumController.getHome);
router.get('/news-list', forumController.getNewsList);
router.get('/news-list/:newsId', forumController.getNewsItem);
router.post('/favouriteNewsList', forumController.postFavouriteNews);
router.get('/user/favourite-news-list', forumController.getFavouriteNewsList);
router.post('/delete-favourite-news', forumController.postDeleteFavouriteItem);

module.exports = router;