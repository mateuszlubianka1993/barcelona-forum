const path = require('path');

const express = require('express');

const newsController = require('../controllers/news');

const router = express.Router();

router.get('/', newsController.getHome);

module.exports = router;