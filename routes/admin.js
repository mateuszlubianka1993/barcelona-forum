const express = require('express');

const adminController = require('../controllers/admin');
const isLogged = require('../utils/is-logged');
const {isPermit} = require('../utils/permission');
const {ROLE} = require('../utils/constants');

const router = express.Router();

router.get('/add-news', isLogged, isPermit(ROLE.ADMIN), adminController.getAddNews);
router.post('/add-news', isLogged, adminController.postAddNews);
router.get('/news-list', isLogged, adminController.getNewsList);
router.get('/edit-news/:newsId', isLogged, adminController.getEditNews);
router.post('/edit-news', isLogged, adminController.postEditNews);
router.post('/delete-news', isLogged, adminController.postDeleteNews);

module.exports = router;
