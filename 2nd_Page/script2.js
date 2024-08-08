// //jquery
// const answerButtons = document.querySelectorAll('.answer');
// const feedback = document.getElementById('feedback');
// const progressBar = document.querySelector('.progress');

// let timeLeft = 60;
// const totalDuration = 60;
// const timerInterval = setInterval(() => {
//     timeLeft--;
//     const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
//     progressBar.style.width = `${progressPercentage}%`;

//     if (timeLeft <= 0) {
//         clearInterval(timerInterval);
//         feedback.textContent = 'Time is up! Please try again.';
//         disableButtons();
//     }
// }, 1000);

// function disableButtons() {
//     answerButtons.forEach(button => {
//         button.disabled = true;
//     });
// }

$(document).ready(() => {
    const progressBar = $('.progress');
    const feedbackContainer = $('#feedback');
    let timerInterval;
    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestions = 0;

    function startProgressBarTimer() {
        resetProgressBar();

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
                }, 1500);
            }
        }, 1000);
    }

    function resetProgressBar() {
        progressBar.css('width', '0%');
        setTimeout(() => {
            progressBar.css('transition', 'width 60s linear');
            progressBar.css('width', '100%');
        }, 50);
    }

    function disableButtons() {
        $('.answer').prop('disabled', true);
    }

    function showQuestion(index) {
        if (!questions || questions.length === 0) {
            console.error('Questions are not available.');
            return;
        }

        if (index >= questions.length) {
            console.error('Index out of bounds.');
            return;
        }

        const questionData = questions[index];
        const questionContainer = $('.question-box .question');
        const answersContainer = $('.answers');

        questionContainer.text(decodeHtml(questionData.question));
        answersContainer.empty();
        feedbackContainer.text('');

        const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5);

        allAnswers.forEach(answer => {
            const button = $('<button>').addClass('answer').text(decodeHtml(answer));
            button.on('click', () => {
                clearInterval(timerInterval);
                if (answer === questionData.correct_answer) {
                    score += 20;
                    feedbackContainer.css('color', 'green').text('Correct!');
                } else {
                    button.addClass('wrong-answer');
                    feedbackContainer.css('color', 'red').text(`Incorrect! The correct answer is: ${decodeHtml(questionData.correct_answer)}`);
                }

                $('.answer').prop('disabled', true);

                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < totalQuestions) {
                        showQuestion(currentQuestionIndex);
                    } else {
                        localStorage.setItem('finalScore', score);
                        window.location.href = '../3rd_Page/index3.html';
                    }
                }, 1500);
            });
            answersContainer.append(button);
        });

        startProgressBarTimer();
    }

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Assuming `questions` and `totalQuestions` are set somewhere globally, e.g., in `api.js`
    if (typeof questions !== 'undefined' && questions.length > 0) {
        totalQuestions = questions.length;
        showQuestion(currentQuestionIndex);
    } else {
        console.error('Questions not loaded or empty.');
    }
});