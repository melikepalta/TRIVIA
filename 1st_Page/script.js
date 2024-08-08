$(document).ready(() => {
    const btn = $('.btn');
    const warning = $('#warning');

    btn.on('click', () => {
        const category = $('#category-select').val();
        const difficulty = $('#difficulty-select').val();

        if (category === '' || difficulty === '') {
            warning.text('Please select both a category and a difficulty level.');
        } else {
            warning.text(''); 
            
            // Redirect to the second page with query parameters
            window.location.href = `../2nd_Page/index2.html?category=${category}&difficulty=${difficulty}`; 
        }
    });
});