// Import packages and properties we will be using
const inquirer = require('inquirer');
const { pool } = require('./config/config.js');

// Function to display menu options
function menu() {
    // List of options
    const options = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "Employee Operations",
                "Role Operations",
                "Department Operations",
                "Quit"
            ]
        }
    ];

    // Prompt the user for input
    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

// Function to display menu options for employees
function employeeMenu() {
    // List of options
    const options = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Employee",
                "Return to Main Menu"
            ]
        }
    ];

    // Prompt the user for input
    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

// Function to display menu options for roles
function roleMenu() {
    // List of options
    const options = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View All Roles",
                "Add Role",
                "Delete Role",
                "Return to Main Menu"
            ]
        }
    ];

    // Prompt the user for input
    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

// Function to display menu options for department
function departmentMenu() {
    // List of options
    const options = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View All Departments",
                "Add Department",
                "View Department Budget",
                "Delete Department",
                "Return to Main Menu"
            ]
        }
    ];

    // Prompt the user for input
    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

// Function to call the appropriate functions based on which options were selected
function query(response) {
    switch(response) {
        case "Employee Operations":
            employeeMenu();
            break;
        case "View All Employees":
            viewAllEmployees();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "Update Employee Manager":
            updateEmployeeManager();
            break;
        case "View Employees by Manager":
            viewEmployeesByManager();
            break;
        case "View Employees by Department":
            viewEmployeesByDepartment();
            break;
        case "Delete Employee":
            deleteEmployee();
            break;
        case "Role Operations":
            roleMenu();
            break;
        case "View All Roles":
            viewAllRoles();
            break;
        case "Add Role":
            addRole();
            break;
        case "Delete Role":
            deleteRole();
            break;
        case "Department Operations":
            departmentMenu();
            break;
        case "View All Departments":
            viewAllDepartments();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "View Department Budget":
            viewDepartmentBudget();
            break;
        case "Delete Department":
            deleteDepartment();
            break;
        case "Return to Main Menu":
            menu();
            break;
        case "Quit":
            process.exit();
    }
}

// Function to view all the employees in the table
function viewAllEmployees() {
    // Query that selects specific columns and combinations to display
    pool.query(`SELECT employee.id, employee.first_name, employee.last_name,
                role.title, department.name AS department, role.salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM department
                JOIN role ON role.department_id = department.id
                JOIN employee ON employee.role_id = role.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id
                ORDER BY employee.id`, (err, { rows }) => {
        if (err) {
            console.log(err);
        }

        // Display the table and return to the menu
        console.table(rows);
        menu();
    });
}

// Function to add an employee
function addEmployee() {
    // Populate a list of roles and managers to select from
    const roles = [];
    const managers = [];

    // Option for the employee to have no manager
    const none = {
        value: null,
        name: "None"
    };

    managers.push(none);

    // Query that selects all the employees from the table as eligible for being a manager
    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const manager = {
                value: rows[i].id,
                name: rows[i].manager
            };
            
            managers.push(manager);
        }
    });

    // Query that selects all the possible roles for the new employee
    pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const role = {
                value: rows[i].id,
                name: rows[i].title
            };
            
            roles.push(role);
        }
    });

    // List of questions
    const questions = [
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: roles
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "manager",
            choices: managers
        },
    ];

    // Prompt the user for input
    inquirer.prompt(questions)
    .then((response) => {
        // Query to insert the new employee into the table with the given response parameters
        pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ($1, $2, $3, $4)`,
                    [response.firstName, response.lastName, response.role, response.manager], (err) => {
            if (err) {
                console.log(err);
            }

            // Console log the message and return to the menu
            console.log(`Employee '${response.firstName} ${response.lastName}' was added to the database ...`);
            menu();
        });
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    // Populate a list of employees and roles to select from
    const employees = [];
    const roles = [];

    // Query that selects all the employees from the table
    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const employee = {
                value: rows[i].id,
                name: rows[i].employee
            };
            
            employees.push(employee);
        }

        // Query that selects all the possible roles to update for the employee
        pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
            for (let i = 0; i < rows.length; i++) {
                const role = {
                    value: rows[i].id,
                    name: rows[i].title
                };
                
                roles.push(role);
            }

            // List of questions
            const questions = [
                {
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    name: "employee",
                    choices: employees
                },
                {
                    type: "list",
                    message: "Which role do you want to assign to the selected employee?",
                    name: "role",
                    choices: roles
                },
            ];

            // Prompt the user for input
            inquirer.prompt(questions)
            .then((response) => {
                // Query to update the employee's role with the given response parameters
                pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,
                            [response.role, response.employee], (err) => {
                    if (err) {
                        console.log(err);
                    }

                    // Console log the message and return to the menu
                    console.log(`Updated role of employee ...`);
                    menu();
                });
            });
        });
    });
}

// Function to update an employee's manager
function updateEmployeeManager() {
    // Populate a list of employees and managers to select from
    const employees = [];
    const managers = [];

    // Option for the employee to have no manager
    const none = {
        value: null,
        name: "None"
    };

    managers.push(none);

    // Query that selects all the employees from the table
    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const employee = {
                value: rows[i].id,
                name: rows[i].employee
            };
            
            employees.push(employee);
        }

        // List of questions
        const questionOne = [
            {
                type: "list",
                message: "Which employee's manager do you want to update?",
                name: "employee",
                choices: employees
            },
        ];

        // Prompt the user for input
        inquirer.prompt(questionOne)
        .then((responseOne) => {
            // Query that selects all the employees from the table as eligible for being a manager
            pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager
                        FROM employee`, (err, { rows }) => {
                for (let i = 0; i < rows.length; i++) {
                    const manager = {
                        value: rows[i].id,
                        name: rows[i].manager
                    };
                    
                    // An employee cannot be their own manager
                    if (responseOne.employee !== manager.value) {
                        managers.push(manager);
                    }
                }

                // List of questions
                const questionTwo = [
                    {
                        type: "list",
                        message: "Who is the employee's manager?",
                        name: "manager",
                        choices: managers
                    },
                ];

                // Prompt the user for input
                inquirer.prompt(questionTwo)
                .then((responseTwo) => {
                    // Query to update the employee's manager with the given response parameters
                    pool.query(`UPDATE employee SET manager_id = $1 WHERE id = $2`,
                            [responseTwo.manager, responseOne.employee], (err) => {
                        if (err) {
                            console.log(err);
                        }

                        // Console log the message and return to the menu
                        console.log(`Updated manager of employee ...`);
                        menu();
                    });
                })
            });
        });
    });
}

// Function to view employees by a manager
function viewEmployeesByManager() {
    // Populate a list of managers to select from
    const managers = [];

    // Query that selects all the employees from the table as a manager
    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const manager = {
                value: rows[i].id,
                name: rows[i].manager
            };
            
            managers.push(manager);
        }

        // List of questions
        const questions = [
            {
                type: "list",
                message: "Which manager do you want to view?",
                name: "manager",
                choices: managers
            }
        ];

        // Prompt the user for input
        inquirer.prompt(questions)
        .then((response) => {
            // Query that selects all the employees from the table matching the manager parameter
            pool.query(`SELECT employee.id, employee.first_name, employee.last_name,
                        role.title, department.name AS department, role.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM department
                        JOIN role ON role.department_id = department.id
                        JOIN employee ON employee.role_id = role.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id
                        WHERE employee.manager_id = $1
                        ORDER BY employee.id`,
                        [response.manager], (err, { rows }) => {
                if (err) {
                    console.log(err);
                }

                // If the manager has no subordinates
                if (rows.length === 0) {
                    console.log('This manager has no employees that report to them ...')
                    menu();
                }

                else {
                    // Display the table and return to the menu
                    console.log('Displaying all the employees that report to this manager ...');
                    console.table(rows);
                    menu();
                }
            });
        });
    });
}

// Function to view employees by a department
function viewEmployeesByDepartment() {
    // Populate a list of departments to select from
    const departments = [];

    // Query that selects all the departments from the table
    pool.query(`SELECT * FROM department`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const department = {
                value: rows[i].id,
                name: rows[i].name
            };

            departments.push(department);
        }

        // List of questions
        const questions = [
            {
                type: "list",
                message: "Which department do you want to view?",
                name: "department",
                choices: departments
            }
        ];

        // Prompt the user for input
        inquirer.prompt(questions)
        .then((response) => {
            // Query that selects all the employees from the table matching the department parameter
            pool.query(`SELECT employee.id, employee.first_name, employee.last_name,
                        role.title, department.name AS department, role.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM department
                        JOIN role ON role.department_id = department.id
                        JOIN employee ON employee.role_id = role.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id
                        WHERE department.id = $1
                        ORDER BY employee.id`,
                        [response.department], (err, { rows }) => {
                if (err) {
                    console.log(err);
                }

                // Display the table and return to the menu
                console.log('Displaying all the employees in this department ...');
                console.table(rows);
                menu();
            });
        });
    });
}

// Function to delete an employee
function deleteEmployee() {
    // Populate a list of employees to select from
    const employees = [];

    // Query that selects all the employees from the table
    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const employee = {
                value: rows[i].id,
                name: rows[i].employee
            };
            
            employees.push(employee);
        }

        // List of questions
        const questions = [
            {
                type: "list",
                message: "Which employee do you want to delete?",
                name: "employee",
                choices: employees
            },
        ];

        // Prompt the user for input
        inquirer.prompt(questions)
        .then((response) => {
            // Query to delete the selected employee from the table
            pool.query(`DELETE FROM employee WHERE id = $1`,
                    [response.employee], (err) => {
                if (err) {
                    console.log(err);
                }

                // Console log the message and return to the menu
                console.log(`Deleted employee from the database ...`);
                menu();
            });
        });
    });
}

// Function to view all the roles in the table
function viewAllRoles() {
    // Query that selects specific columns and combinations to display
    pool.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM department
                LEFT JOIN role ON role.department_id = department.id
                ORDER BY role.id`, (err, { rows }) => {
        if (err) {
            console.log(err);
        }

        // Display the table and return to the menu
        console.table(rows);
        menu();
    });
}

function addRole() {
    // Populate a list of departments to select from
    const departments = [];

    // Query that selects all the departments from the table
    pool.query(`SELECT * FROM department`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const department = {
                value: rows[i].id,
                name: rows[i].name
            };

            departments.push(department);
        }
    });

    // List of questions
    const questions = [
        {
            type: "input",
            message: "What is the name of the role?",
            name: "role"
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary"
        },
        {
            type: "list",
            message: "Which department does the role belong to?",
            name: "department",
            choices: departments
        }
    ];

    // Prompt the user for input
    inquirer.prompt(questions)
    .then((response) => {
        // Query to insert the new role into the table with the given response parameters
        pool.query(`INSERT INTO role (title, salary, department_id)
                    VALUES ($1, $2, $3)`, [response.role, response.salary, response.department], (err) => {
            if (err) {
                console.log(err);
            }

            // Console log the message and return to the menu
            console.log(`The role '${response.role}' was added to the database ...`);
            menu();
        });
    });
}

function deleteRole() {
    // Populate a list of roles to select from
    const roles = [];

    // Query that selects all the roles from the table
    pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const role = {
                value: rows[i].id,
                name: rows[i].title
            }
            
            roles.push(role);
        }

        // List of questions
        const questions = [
            {
                type: "list",
                message: "Which role do you want to delete?",
                name: "role",
                choices: roles
            },
        ];

        // Prompt the user for input
        inquirer.prompt(questions)
        .then((response) => {
            // Query to delete the selected role from the table
            pool.query(`DELETE FROM role WHERE id = $1`,
                    [response.role], (err) => {
                if (err) {
                    console.log(err);
                }

                // Console log the message and return to the menu
                console.log(`Deleted role from the database ...`);
                menu();
            });
        });
    });
}

// Function to view all the departments in the table
function viewAllDepartments() {
    // Query that selects all the columns from the department table to display
    pool.query(`SELECT * FROM department
                ORDER BY department.id`, (err, { rows }) => {
        if (err) {
            console.log(err);
        }

        // Display the table and return to the menu
        console.table(rows);
        menu();
    });
}

function addDepartment() {
    // List of questions
    const questions = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department"
        }
    ];

    // Prompt the user for input
    inquirer.prompt(questions)
    .then((response) => {
        // Query to insert the new department into the table with the given response parameters
        pool.query(`INSERT INTO department (name)
                    VALUES ($1)`, [response.department], (err) => {
            if (err) {
                console.log(err);
            }

            // Console log the message and return to the menu
            console.log(`The department '${response.department}' was added to the database ...`);
            menu();
        });
    });
}

function viewDepartmentBudget() {
    // Populate a list of departments to select from
    const departments = [];

    // Query that selects all the departments from the table
    pool.query(`SELECT * FROM department`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const department = {
                value: rows[i].id,
                name: rows[i].name
            };

            departments.push(department);
        }

        // List of questions
        const questions = [
            {
                type: "list",
                message: "Which department's budget do you want to view?",
                name: "department",
                choices: departments
            },
        ];

        // Prompt the user for input
        inquirer.prompt(questions)
        .then((response) => {
            // Query that sums up all the salaries of the employees in the department as the budget
            pool.query(`SELECT department.id, department.name, SUM(role.salary) AS department_budget
                        FROM department
                        JOIN role ON role.department_id = department.id
                        JOIN employee ON employee.role_id = role.id
                        WHERE department.id = $1
                        GROUP BY department.id`,
                    [response.department], (err, { rows }) => {
                if (err) {
                    console.log(err);
                }

                // Display the table and return to the menu
                console.table(rows);
                menu();
            });
        });
    });
}

function deleteDepartment() {
    // Populate a list of departments to select from
    const departments = [];

    // Query that selects all the departments from the table
    pool.query(`SELECT * FROM department`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const department = {
                value: rows[i].id,
                name: rows[i].name
            };

            departments.push(department);
        }

        // List of questions
        const questions = [
            {
                type: "list",
                message: "Which department do you want to delete?",
                name: "department",
                choices: departments
            },
        ];

        // Prompt the user for input
        inquirer.prompt(questions)
        .then((response) => {
            // Query to delete the selected department from the table
            pool.query(`DELETE FROM department WHERE id = $1`,
                    [response.department], (err) => {
                if (err) {
                    console.log(err);
                }

                // Console log the message and return to the menu
                console.log(`Deleted department from the database ...`);
                menu();
            });
        });
    });
}

// Export our menu function
module.exports = { menu };
