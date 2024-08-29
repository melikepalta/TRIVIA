const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');

router.get('/', quizController.renderQuiz);

module.exports = router;
