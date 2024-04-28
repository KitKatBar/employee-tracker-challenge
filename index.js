const inquirer = require('inquirer');
const { connect } = require('./server.js');

const options = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"
        ]
    }
]

async function init() {
    connect();

    let ask = true;
    
    console.log(',----------------------------------------------------.\n' +
                '|                                                    |\n' +
                '|    _____                 _                         |\n' +
                '|   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   |\n' +
                '|   |  _| | \'_ ` _ \\| \'_ \\| |/ _ \\| | | |/ _ \\/ _ \\  |\n' +
                '|   | |___| | | | | | |_) | | (_) | |_| |  __/  __/  |\n' +
                '|   |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  |\n' +
                '|                   |_|            |___/             |\n' +
                '|    __  __                                          |\n' +
                '|   |  \\/  | __ _ _ __   __ _  __ _  ___ _ __        |\n' +
                '|   | |\\/| |/ _` | \'_ \\ / _` |/ _` |/ _ \\ \'__|       |\n' +
                '|   | |  | | (_| | | | | (_| | (_| |  __/ |          |\n' +
                '|   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|          |\n' +
                '|                             |___/                  |\n' +
                '|                                                    |\n' +
                '`----------------------------------------------------\'');

    while (ask) {
        await inquirer.prompt(options)
        .then((response) => {
            ask = query(response.choice);
        });
    }

    process.exit();
}

function query(response) {
    console.log(response);
    switch(response) {
        case "View All Employees":
            return true;
        case "Add Employee":
            return true;
        case "Update Employee Role":
            return true;
        case "View All Roles":
            return true;
        case "Add Role":
            return true;
        case "View All Departments":
            return true;
        case "Add Department":
            return true;
        case "Quit":
            return false;
    }
}

init();
