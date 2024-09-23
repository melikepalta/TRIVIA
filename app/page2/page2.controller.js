exports.renderPage2 = (req, res) => {
    const { category, difficulty } = req.query;
    console.log(`Category: ${category}, Difficulty: ${difficulty}`);
    
    // Pass the category and difficulty to the template, or fetch questions based on them
    res.render('./page2', { category, difficulty });
};
