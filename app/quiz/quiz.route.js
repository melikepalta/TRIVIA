const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');
const axios = require('axios');


router.get('/', quizController.renderQuiz);

router.get('/question/:id', quizController.getQuestion); // Fetches each question
router.post('/finish', quizController.finishQuiz); // Handles quiz completion

module.exports = router;
