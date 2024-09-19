$(document).ready(() => {
    // Get the final score from localStorage
    const finalScore = localStorage.getItem('finalScore') || 0;

    // Display the score in the HTML element with the ID 'finalScore'
    $('#finalScore').text(`You Earned ${finalScore} Points!`);
});
