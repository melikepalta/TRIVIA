const express = require('express');
const router = express.Router();
const startPointController = require('./start-point.controller.js');

// Handle GET request to /start-point
router.get('/', startPointController.renderStartPoint);

module.exports = router;