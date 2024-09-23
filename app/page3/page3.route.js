const express = require('express');
const router = express.Router();
const page3Controller = require('./page3.controller');

//defines route for page 3
router.get('/', page3Controller.renderPage3);

module.exports = router;
