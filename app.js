const express = require('express');
const app = express();
const path = require('path');
const startPointRoute = require('./app/start-point/start-point.route.js');

// Setup Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the start-point route
app.use('/start-point', startPointRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});