const express = require('express');

const forumController = require('../controllers/forum');
const isLogged = require('../utils/is-logged');

const router = express.Router();

router.get('/', forumController.getHome);
router.get('/news-list', forumController.getNewsList);
router.get('/news-list/:newsId', forumController.getNewsItem);
router.post('/favouriteNewsList', isLogged, forumController.postFavouriteNews);
router.get('/user/favourite-news-list', isLogged, forumController.getFavouriteNewsList);
router.post('/delete-favourite-news', isLogged, forumController.postDeleteFavouriteItem);
router.get('/history', forumController.getHistory);
router.get('/anthem', forumController.getAnthem);
router.get('/trophies', forumController.getTrophies);
router.post('/add-comment', isLogged, forumController.postAddComment);
router.post('/favouriteCommentsList', isLogged, forumController.postFavouriteComments);

module.exports = router;