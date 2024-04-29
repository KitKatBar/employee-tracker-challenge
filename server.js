const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool(
    {
        user: '',
        password: '',
        host: 'localhost',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
)

function connect() {
    pool.connect();
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
                ON employee.manager_id = manager.id`, function (err, { rows }) {
        if (err) {
            console.log(err);
        }

        console.log('\n');
        console.table(rows);
        return;
    });
}

function addEmployee() {

}

function updateEmployeeRole() {

}

function viewAllRoles() {
    pool.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM department
                LEFT JOIN role
                ON role.department_id = department.id`, function (err, { rows }) {
        if (err) {
            console.log(err);
        }

        console.log('\n');
        console.table(rows);
    });
}

function addRole() {

}

function viewAllDepartments() {
    pool.query(`SELECT * FROM department
                ORDER BY department.name`, function (err, { rows }) {
        if (err) {
            console.log(err);
        }

        console.log('\n');
        console.table(rows);
    });
}

function addDepartment() {
    const questions = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department"
        }
    ]

    inquirer.prompt(questions)
    .then((response) => {
        console.log(response);
    })
}

module.exports = { connect, viewAllEmployees, addEmployee, updateEmployeeRole,
    viewAllRoles, addRole, viewAllDepartments, addDepartment };
