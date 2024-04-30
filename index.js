const inquirer = require('inquirer');
const { connect } = require('./config/config.js');
const { menu } = require('./query.js');
// const { viewAllEmployees, addEmployee, updateEmployeeRole,
//     viewAllRoles, addRole, viewAllDepartments, addDepartment } = require('./query.js');

function init() {
    connect();

    menu();
}

// function menu() {
//     inquirer.prompt(options)
//     .then((response) => {
//         query(response.choice);
//     });
// }

// function query(response) {
//     switch(response) {
//         case "View All Employees":
//             viewAllEmployees();
//             //menu();
//             break;
//         case "Add Employee":
//             addEmployee();
//             //menu();
//             break;
//         case "Update Employee Role":
//             updateEmployeeRole();
//             //menu();
//             break;
//         case "View All Roles":
//             viewAllRoles();
//             //menu();
//             break;
//         case "Add Role":
//             addRole();
//             //menu();
//             break;
//         case "View All Departments":
//             viewAllDepartments();
//             //menu();
//             break;
//         case "Add Department":
//             addDepartment();
//             //menu();
//             break;
//         case "Quit":
//             process.exit();
//     }
// }

// function viewAllEmployees() {
//     pool.query(`SELECT employee.id, employee.first_name, employee.last_name,
//                 role.title, department.name AS department, role.salary,
//                 CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM department
//                 JOIN role
//                 ON role.department_id = department.id
//                 JOIN employee
//                 ON employee.role_id = role.id
//                 LEFT JOIN employee manager
//                 ON employee.manager_id = manager.id`, (err, { rows }) => {
//         if (err) {
//             console.log(err);
//         }

//         //console.log('\n');
//         console.table(rows);
//         menu();
//     });
// }

// function addEmployee() {
//     const roles = [];
//     const managers = [];

//     const none = {
//         value: null,
//         name: "None"
//     }

//     managers.push(none);

//     pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager
//                 FROM employee`, (err, { rows }) => {
//         for (let i = 0; i < rows.length; i++) {
//             const manager = {
//                 value: rows[i].id,
//                 name: rows[i].manager
//             }
            
//             managers.push(manager);
//         }
//     });

//     pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
//         for (let i = 0; i < rows.length; i++) {
//             const role = {
//                 value: rows[i].id,
//                 name: rows[i].title
//             }
            
//             roles.push(role);
//         }
//     });

//     const questions = [
//         {
//             type: "input",
//             message: "What is the employee's first name?",
//             name: "firstName"
//         },
//         {
//             type: "input",
//             message: "What is the employee's last name?",
//             name: "lastName"
//         },
//         {
//             type: "list",
//             message: "What is the employee's role?",
//             name: "role",
//             choices: roles
//         },
//         {
//             type: "list",
//             message: "Who is the employee's manager?",
//             name: "manager",
//             choices: managers
//         },
//     ];

//     inquirer.prompt(questions)
//     .then((response) => {
//         pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
//                     VALUES ($1, $2, $3, $4)`,
//                     [response.firstName, response.lastName, response.role, response.manager], (err) => {
//             if (err) {
//                 console.log(err);
//             }

//             console.log(`The employee '${response.firstName} ${response.lastName}' was added to the database ...`);
//             menu();
//         });
//     });
// }

// function updateEmployeeRole() {
//     const employees = [];
//     const roles = [];

//     pool.query(`SELECT id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
//                 FROM employee`, (err, { rows }) => {
//         for (let i = 0; i < rows.length; i++) {
//             const employee = {
//                 value: rows[i].id,
//                 name: rows[i].employee
//             }
            
//             employees.push(employee);
//         }

//         pool.query(`SELECT id, title FROM role`, (err, { rows }) => {
//             for (let i = 0; i < rows.length; i++) {
//                 const role = {
//                     value: rows[i].id,
//                     name: rows[i].title
//                 }
                
//                 roles.push(role);
//             }

//             const questions = [
//                 {
//                     type: "list",
//                     message: "Which employee's role do you want to update?",
//                     name: "employee",
//                     choices: employees
//                 },
//                 {
//                     type: "list",
//                     message: "Which role do you want to assign to the selected employee?",
//                     name: "role",
//                     choices: roles
//                 },
//             ];

//             inquirer.prompt(questions)
//             .then((response) => {
//                 pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`,
//                             [response.role, response.employee], (err) => {
//                     if (err) {
//                         console.log(err);
//                     }

//                     console.log(`Updated role of '${response.firstName} ${response.lastName}' ...`);
//                     menu();
//                 });
//             });
//         });
//     });
// }

// function viewAllRoles() {
//     pool.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM department
//                 LEFT JOIN role
//                 ON role.department_id = department.id`, (err, { rows }) => {
//         if (err) {
//             console.log(err);
//         }

//         console.log('\n');
//         console.table(rows);
//         menu();
//     });
// }

// function addRole() {
//     const departments = [];

//     pool.query(`SELECT * FROM department`, (err, { rows }) => {
//         for (let i = 0; i < rows.length; i++) {
//             const role = {
//                 value: rows[i].id,
//                 name: rows[i].name
//             }

//             departments.push(role);
//         }
//     });

//     const questions = [
//         {
//             type: "input",
//             message: "What is the name of the role?",
//             name: "role"
//         },
//         {
//             type: "input",
//             message: "What is the salary of the role?",
//             name: "salary"
//         },
//         {
//             type: "list",
//             message: "Which department does the role belong to?",
//             name: "department",
//             choices: departments
//         }
//     ];

//     inquirer.prompt(questions)
//     .then((response) => {
//         pool.query(`INSERT INTO role (title, salary, department_id)
//                     VALUES ($1, $2, $3)`, [response.role, response.salary, response.department], (err) => {
//             if (err) {
//                 console.log(err);
//             }

//             console.log(`The role '${response.role}' was added to the database ...`);
//             menu();
//         });
//     });
// }

// function viewAllDepartments() {
//     pool.query(`SELECT * FROM department
//                 ORDER BY department.name`, (err, { rows }) => {
//         if (err) {
//             console.log(err);
//         }

//         console.log('\n');
//         console.table(rows);
//         menu();
//     });
// }

// function addDepartment() {
//     const questions = [
//         {
//             type: "input",
//             message: "What is the name of the department?",
//             name: "department"
//         }
//     ];

//     inquirer.prompt(questions)
//     .then((response) => {
//         pool.query(`INSERT INTO department (name)
//                     VALUES ($1)`, [response.department], (err) => {
//             if (err) {
//                 console.log(err);
//             }

//             console.log(`The department '${response.department}' was added to the database ...`);
//             menu();
//         });
//     });
// }

// function updateEmployeeManager() {

// }

// function viewEmployeesByManager() {

// }

// function viewEmployeesByDepartment() {

// }

// function deleteEmployee() {

// }

// function deleteRole() {

// }

// function deleteDepartment() {

// }

// function viewDepartmentBudget() {

// }

// module.exports = { menu };

// module.exports = { connect, viewAllEmployees, addEmployee, updateEmployeeRole,
//     viewAllRoles, addRole, viewAllDepartments, addDepartment };

init();
