// Import function packages from other files
const { connect } = require('./config/config.js');
const { menu } = require('./query.js');

// Function to initialize
function init() {
    // Connect to the database
    connect();
    // Display the menu options
    menu();
}

// Initialize the app
init();
