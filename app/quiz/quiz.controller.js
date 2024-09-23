const axios = require('axios');

let questions = []; // To store the fetched questions

// Render the quiz page and fetch questions based on category and difficulty
exports.renderQuiz = async (req, res) => {
  const { category, difficulty } = req.query;

  // Ensure category and difficulty are provided
  if (!category || !difficulty) {
    return res.status(400).send("Category and difficulty are required.");
  }

  try {
    // Fetch questions from the trivia API
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await axios.get(apiUrl);

    // Handle API response if no questions are found
    if (response.data.response_code !== 0) {
      return res.status(400).send("No questions found for the selected category and difficulty.");
    }

    // Store questions globally or locally for session
    questions = response.data.results;

    // Extract the first question and its answers to render the page
    const firstQuestion = questions[0];
    const formattedQuestion = {
      question: firstQuestion.question,
      answers: [...firstQuestion.incorrect_answers, firstQuestion.correct_answer].sort(() => Math.random() - 0.5) // Shuffle answers
    };

    // Render the quiz page and pass the first question to the template
    res.render('quiz/quiz', { question: formattedQuestion.question, answers: formattedQuestion.answers });

  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    res.status(500).send('An error occurred while fetching the quiz questions.');
  }
};

// Provide the question based on the index
exports.getQuestion = (req, res) => {
  const questionIndex = req.params.id;

  // Ensure the question index is valid
  if (questionIndex < 0 || questionIndex >= questions.length) {
    return res.status(404).send("Question not found.");
  }

  const currentQuestion = questions[questionIndex];
  const formattedQuestion = {
    question: currentQuestion.question,
    answers: [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5)
  };

  res.json({ question: formattedQuestion });
};

// Handle quiz completion and score submission
exports.finishQuiz = (req, res) => {
  const { score } = req.body;

  // Log or save the score (can be saved to a database or file if needed)
  console.log(`Final Score: ${score}`);

  // Send a success response
  res.status(200).send();
};
