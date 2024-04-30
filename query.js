const inquirer = require('inquirer');
const { pool } = require('./config.js');

function menu() {
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

    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

function employeeMenu() {
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

    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

function roleMenu() {
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

    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

function departmentMenu() {
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

    inquirer.prompt(options)
    .then((response) => {
        query(response.choice);
    });
}

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

function viewAllEmployees() {
    pool.query(`SELECT employee.id, employee.first_name, employee.last_name,
                role.title, department.name AS department, role.salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM department
                JOIN role
                ON role.department_id = department.id
                JOIN employee
                ON employee.role_id = role.id
                LEFT JOIN employee manager
                ON employee.manager_id = manager.id
                ORDER BY employee.id`, (err, { rows }) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        menu();
    });
}

function addEmployee() {
    const roles = [];
    const managers = [];

    const none = {
        value: null,
        name: "None"
    };

    managers.push(none);

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

    pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const role = {
                value: rows[i].id,
                name: rows[i].title
            };
            
            roles.push(role);
        }
    });

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

    inquirer.prompt(questions)
    .then((response) => {
        pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ($1, $2, $3, $4)`,
                    [response.firstName, response.lastName, response.role, response.manager], (err) => {
            if (err) {
                console.log(err);
            }

            console.log(`Employee '${response.firstName} ${response.lastName}' was added to the database ...`);
            menu();
        });
    });
}

function updateEmployeeRole() {
    const employees = [];
    const roles = [];

    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const employee = {
                value: rows[i].id,
                name: rows[i].employee
            };
            
            employees.push(employee);
        }

        pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
            for (let i = 0; i < rows.length; i++) {
                const role = {
                    value: rows[i].id,
                    name: rows[i].title
                };
                
                roles.push(role);
            }

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

            inquirer.prompt(questions)
            .then((response) => {
                pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,
                            [response.role, response.employee], (err) => {
                    if (err) {
                        console.log(err);
                    }

                    console.log(`Updated role of employee '${response.firstName} ${response.lastName}' ...`);
                    menu();
                });
            });
        });
    });
}

function updateEmployeeManager() {
    const employees = [];
    const managers = [];

    const none = {
        value: null,
        name: "None"
    };

    managers.push(none);

    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const employee = {
                value: rows[i].id,
                name: rows[i].employee
            };
            
            employees.push(employee);
        }

        const questionOne = [
            {
                type: "list",
                message: "Which employee's manager do you want to update?",
                name: "employee",
                choices: employees
            },
        ];

        inquirer.prompt(questionOne)
        .then((responseOne) => {
            pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager
                FROM employee`, (err, { rows }) => {
                for (let i = 0; i < rows.length; i++) {
                    const manager = {
                        value: rows[i].id,
                        name: rows[i].manager
                    };
                    
                    if (responseOne.employee !== manager.value) {
                        managers.push(manager);
                    }
                }

                const questionTwo = [
                    {
                        type: "list",
                        message: "Who is the employee's manager?",
                        name: "manager",
                        choices: managers
                    },
                ];

                inquirer.prompt(questionTwo)
                .then((responseTwo) => {
                    pool.query(`UPDATE employee SET manager_id = $1 WHERE id = $2`,
                            [responseTwo.manager, responseOne.employee], (err) => {
                        if (err) {
                            console.log(err);
                        }

                        console.log(`Updated manager of employee ...`);
                        menu();
                    });
                })
            });
        });
    });
}

function viewEmployeesByManager() {
    menu();
}

function viewEmployeesByDepartment() {
    menu();
}

function deleteEmployee() {
    const employees = [];

    pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                FROM employee`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const employee = {
                value: rows[i].id,
                name: rows[i].employee
            };
            
            employees.push(employee);
        }

        const questions = [
            {
                type: "list",
                message: "Which employee do you want to delete?",
                name: "employee",
                choices: employees
            },
        ];

        inquirer.prompt(questions)
        .then((response) => {
            pool.query(`DELETE FROM employee WHERE id = $1`,
                    [response.employee], (err) => {
                if (err) {
                    console.log(err);
                }

                console.log(`Deleted employee from the database ...`);
                menu();
            });
        });
    });
}

function viewAllRoles() {
    pool.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM department
                LEFT JOIN role
                ON role.department_id = department.id
                ORDER BY role.id`, (err, { rows }) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        menu();
    });
}

function addRole() {
    const departments = [];

    pool.query(`SELECT * FROM department`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const department = {
                value: rows[i].id,
                name: rows[i].name
            };

            departments.push(department);
        }
    });

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

    inquirer.prompt(questions)
    .then((response) => {
        pool.query(`INSERT INTO role (title, salary, department_id)
                    VALUES ($1, $2, $3)`, [response.role, response.salary, response.department], (err) => {
            if (err) {
                console.log(err);
            }

            console.log(`The role '${response.role}' was added to the database ...`);
            menu();
        });
    });
}

function deleteRole() {
    const roles = [];

    pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const role = {
                value: rows[i].id,
                name: rows[i].title
            }
            
            roles.push(role);
        }
        const questions = [
            {
                type: "list",
                message: "Which role do you want to delete?",
                name: "role",
                choices: roles
            },
        ];

        inquirer.prompt(questions)
        .then((response) => {
            pool.query(`DELETE FROM role WHERE id = $1`,
                    [response.role], (err) => {
                if (err) {
                    console.log(err);
                }

                console.log(`Deleted role from the database ...`);
                menu();
            });
        });
    });
}

function viewAllDepartments() {
    pool.query(`SELECT * FROM department
                ORDER BY department.id`, (err, { rows }) => {
        if (err) {
            console.log(err);
        }

        console.table(rows);
        menu();
    });
}

function addDepartment() {
    const questions = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department"
        }
    ];

    inquirer.prompt(questions)
    .then((response) => {
        pool.query(`INSERT INTO department (name)
                    VALUES ($1)`, [response.department], (err) => {
            if (err) {
                console.log(err);
            }

            console.log(`The department '${response.department}' was added to the database ...`);
            menu();
        });
    });
}

function viewDepartmentBudget() {
    menu();
}

function deleteDepartment() {
    const departments = [];

    pool.query(`SELECT * FROM department`, (err, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
            const department = {
                value: rows[i].id,
                name: rows[i].name
            };

            departments.push(department);
        }

        const questions = [
            {
                type: "list",
                message: "Which role do you want to delete?",
                name: "department",
                choices: departments
            },
        ];

        inquirer.prompt(questions)
        .then((response) => {
            pool.query(`DELETE FROM department WHERE id = $1`,
                    [response.department], (err) => {
                if (err) {
                    console.log(err);
                }
                console.log(response);
                console.log(`Deleted department from the database ...`);
                menu();
            });
        });
    });
}

module.exports = { menu };
