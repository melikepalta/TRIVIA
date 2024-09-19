const express = require('express');
const router = express.Router();
const page2Controller = require('./page2.controller');

router.get('/', page2Controller.renderPage2);

module.exports = router;
