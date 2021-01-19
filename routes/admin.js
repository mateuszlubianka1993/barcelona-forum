const express = require('express');

const adminController = require('../controllers/admin');
const isLogged = require('../utils/is-logged');
const {isPermit} = require('../utils/permission');
const {ROLE} = require('../utils/constants');

const router = express.Router();

router.get('/add-news', isLogged, isPermit([ROLE.ADMIN, ROLE.MOD]), adminController.getAddNews);
router.post('/add-news', isLogged, isPermit([ROLE.ADMIN, ROLE.MOD]), adminController.postAddNews);
router.get('/news-list', isLogged, isPermit([ROLE.ADMIN, ROLE.MOD]), adminController.getNewsList);
router.get('/edit-news/:newsId', isLogged, isPermit([ROLE.ADMIN, ROLE.MOD]), adminController.getEditNews);
router.post('/edit-news', isLogged, isPermit([ROLE.ADMIN, ROLE.MOD]), adminController.postEditNews);
router.post('/delete-news', isLogged, isPermit([ROLE.ADMIN, ROLE.MOD]), adminController.postDeleteNews);
router.get('/users-list', isLogged, isPermit([ROLE.ADMIN]), adminController.getUsersList);
router.post('/delete-user', isLogged, isPermit([ROLE.ADMIN]), adminController.postDeleteUser);
router.get('/edit-user/:userId', isLogged, isPermit([ROLE.ADMIN]), adminController.getEditUser);

module.exports = router;
