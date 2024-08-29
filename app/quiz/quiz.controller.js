const axios = require('axios');

exports.renderQuiz = async (req, res) => {
  
  const { category, difficulty } = req.query;

  if (!category || !difficulty) {
    return res.status(400).send('Category and difficulty are required.);
  }

  try {
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await axios.get(apiUrl);

    if (response.data.response_code !== 0) {
      return res.status(400).send('No questions found for the selected category and difficulty.');
  }

    const questions = reponse.data.results;
    res.render('quiz/quiz', { questions });

  } catch (error) {
      console.error('Error fetching trivia questions:', error);
      res.status(500).send('An error occurred while fetching the quiz questions.');
    }
};
    
