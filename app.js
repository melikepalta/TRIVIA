const express = require('express');
const app = express();
const path = require('path');

//import routes here:
const startPointRoute = require('./app/start-point/start-point.route.js');
const quizRoute = require('./app/quiz/quiz.route.js'); //import the quiz route
const page2Route = require('./app/page2/page2.route.js'); // Add page 2 route
const page3Route = require('./app/page3/page3.route.js'); // Add page 3 route

// Setup Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the start-point route
app.use('/start-point', startPointRoute);
app.use('/quiz', quizRoute); //used the quiz route
app.use('/page2', page2Route); // use page 2 route
app.use('/page3', page3Route); // use page 3 route

app.get('/', (req, res) => {
    res.redirect('/start-point');  // Redirect to /start-point
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

