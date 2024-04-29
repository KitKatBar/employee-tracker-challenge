const inquirer = require('inquirer');
const { connect, viewAllEmployees, addEmployee, updateEmployeeRole,
    viewAllRoles, addRole, viewAllDepartments, addDepartment } = require('./server.js');

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

function init() {
    connect();
    
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

    menu();
}

function menu() {
    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

function query(response) {
    switch(response) {
        case "View All Employees":
            viewAllEmployees();
            menu();
            break;
        case "Add Employee":
            menu();
            break;
        case "Update Employee Role":
            menu();
            break;
        case "View All Roles":
            viewAllRoles();
            menu();
            break;
        case "Add Role":
            menu();
            break;
        case "View All Departments":
            viewAllDepartments();
            menu();
            break;
        case "Add Department":
            addDepartment();
            menu();
            break;
        case "Quit":
            process.exit();
    }
}

init();
