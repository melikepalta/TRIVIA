document.addEventListener('DOMContentLoaded', () => {
    // Function to get query parameters
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            category: params.get('category'),
            difficulty: params.get('difficulty')
        };
    }

    const { category, difficulty } = getQueryParams();

    if (!category || !difficulty) {
        alert('Category or difficulty not set.');
        return;
    }

    // Fetch data from the API
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            if (data.response_code === 0) {
                displayQuestions(data.results);
            } else {
                alert('No questions found for the selected category and difficulty.');
            }
        })
        .catch(error => console.error('Error fetching the trivia questions:', error));
});

// Function to decode HTML entities
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function displayQuestions(questions) {
    const questionContainer = $('.question-box .question');
    const answersContainer = $('.answers');
    const progressBar = $('.progress');
    const feedbackContainer = $('#feedback');

    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestions = questions.length;
    let timerInterval;

    function showQuestion(index) {
        questionContainer.text(decodeHtml(questions[index].question));
        answersContainer.empty();
        feedbackContainer.text(''); // Clear feedback

        const allAnswers = [...questions[index].incorrect_answers, questions[index].correct_answer].sort(() => Math.random() - 0.5);

        allAnswers.forEach(answer => {
            const button = $('<button>').addClass('answer').text(decodeHtml(answer));
            button.on('click', () => {
                clearInterval(timerInterval); // Clear the timer when an answer is clicked
                if (answer === questions[index].correct_answer) {
                    score += 20;
                    feedbackContainer.css('color', 'green').text('Correct!');
                } else {
                    button.addClass('wrong-answer');
                    feedbackContainer.css('color', 'red').text(`Incorrect! The correct answer is: ${decodeHtml(questions[index].correct_answer)}`);
                }

                // Disable buttons after one is clicked
                $('.answer').prop('disabled', true);

                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < totalQuestions) {
                        showQuestion(currentQuestionIndex);
                    } else {
                        localStorage.setItem('finalScore', score);
                        window.location.href = '../3rd_Page/index3.html';
                    }
                }, 2000); // Wait for 2 seconds before showing the next question
            });
            answersContainer.append(button);
        });

        // Start progress bar timer
        startProgressBarTimer();
    }

    function resetProgressBar() {
        progressBar.css('width', '0%'); // Reset progress bar to 0%
    }

    function startProgressBarTimer() {
        resetProgressBar(); // Reset progress bar before starting

        let timeLeft = 60;
        const totalDuration = 60;

        timerInterval = setInterval(() => {
            timeLeft--;
            const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
            progressBar.css('width', `${progressPercentage}%`);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                feedbackContainer.css('color', 'red').text('Time is up! Moving to the next question.');
                disableButtons();

                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < totalQuestions) {
                        showQuestion(currentQuestionIndex);
                    } else {
                        localStorage.setItem('finalScore', score);
                        window.location.href = '../3rd_Page/index3.html';
                    }
                }, 2000); // Wait for 2 seconds before showing the next question
            }
        }, 1000);
    }

    function disableButtons() {
        $('.answer').prop('disabled', true);
    }

    showQuestion(currentQuestionIndex);
}