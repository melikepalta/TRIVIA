$(document).ready(() => {
  const progressBar = $('.progress');
  const feedbackContainer = $('#feedback');
  let timerInterval;
  let currentQuestionIndex = 0;
  let score = 0;
  let totalQuestions = 10; // You can set this dynamically later

  // Retrieve category and difficulty from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const difficulty = urlParams.get('difficulty');

  console.log(`Category: ${category}, Difficulty: ${difficulty}`);  // For debugging

  // Function to start the timer (progress bar)
  function startProgressBarTimer() {
      resetProgressBar(); // Reset progress bar before starting

      let timeLeft = 60; // Set time for each question (60 seconds)
      const totalDuration = 60;

      timerInterval = setInterval(() => {
          timeLeft--;
          const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
          progressBar.css('width', `${progressPercentage}%`);

          if (timeLeft <= 0) {
              clearInterval(timerInterval); // Stop the timer when it reaches 0
              feedbackContainer.css('color', 'red').text('Time is up! Moving to the next question.');
              disableButtons(); // Disable answer buttons when time runs out

              setTimeout(() => {
                  loadNextQuestion(); // Automatically load the next question
              }, 1500);
          }
      }, 1000); // Timer updates every 1 second
  }

  // Function to reset the progress bar to 0%
  function resetProgressBar() {
      progressBar.css('width', '0%');
      setTimeout(() => {
          progressBar.css('transition', 'width 60s linear');
          progressBar.css('width', '100%'); // Slowly fill the progress bar over 60 seconds
      }, 50);
  }

  // Function to disable the answer buttons after one is clicked or when time runs out
  function disableButtons() {
      $('.answer').prop('disabled', true); // Disable all answer buttons
  }

  // Function to load and display the next question
  function loadNextQuestion() {
      currentQuestionIndex++; // Move to the next question

      if (currentQuestionIndex < totalQuestions) {
          $.get(`/quiz/question/${currentQuestionIndex}?category=${category}&difficulty=${difficulty}`, (data) => {
              showQuestion(data.question); // Load next question data from the server
          });
      } else {
          $.post('/quiz/finish', { score: score }, () => {
              window.location.href = '/page3'; // Redirect to the trophy page with the final score
          });
      }
  }

  // Function to display the current question and its answers
  function showQuestion(questionData) {
      const questionContainer = $('.question-box .question'); // Question element
      const answersContainer = $('.answers'); // Answers container

      questionContainer.text(decodeHtml(questionData.question)); // Display the question
      answersContainer.empty(); // Clear old answers
      feedbackContainer.text(''); // Clear previous feedback

      const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5); // Shuffle answers

      // Display answers as buttons
      allAnswers.forEach(answer => {
          const button = $('<button>').addClass('answer').text(decodeHtml(answer));
          button.on('click', () => {
              clearInterval(timerInterval); // Stop the timer when an answer is clicked
              if (answer === questionData.correct_answer) {
                  score += 20; // Add score for correct answer
                  feedbackContainer.css('color', 'green').text('Correct!');
              } else {
                  button.addClass('wrong-answer'); // Mark wrong answers
                  feedbackContainer.css('color', 'red').text(`Incorrect! The correct answer is: ${decodeHtml(questionData.correct_answer)}`);
              }

              disableButtons(); // Disable buttons after an answer is clicked

              setTimeout(() => {
                  loadNextQuestion(); // Load the next question
              }, 1500);
          });
          answersContainer.append(button);
      });

      startProgressBarTimer(); // Start the timer for the current question
  }

  // Helper function to decode HTML entities in question/answer text
  function decodeHtml(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
  }

  // Start by loading the first question
  loadNextQuestion();
});
