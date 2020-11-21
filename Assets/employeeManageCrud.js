const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_managementDB"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connection successful!");
});
// array holding questions to determine if user wants to view, add, remove, or update
// mvp
const userToDo = [{
    type: "list",
    message: "Hello and welcome to the Employee Manager app! What would you like to do?",
    choices: ["View All Employees", "View All Employees By Department", "View All Roles", "Add Employee", "Add Role", "Update Employee Role", "Quit"],
    name: "userToDoRes"
}];

// bonus
// const userToDo = [{
//     type: "list",
//     message: "Hello and welcome to the Employee Manager app! What would you like to do?",
//     choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "Add Role", "Remove Role", "Remove Department"],
//     name: "userToDoRes"
// }];

const init = () => {
    inquirer.prompt(userToDo).then(res => {
        switch (res.userToDoRes) {
            case "View All Employees":
                viewAllEmp();
                break;
            case "View All Employees By Department":
                viewAllEmpDep();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Employee":
                addEmp();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmpRole();
                break;
            case "Quit":
                connection.end();
                break;
        }
    });
}

const viewAllEmp = () => {
    console.log("test view all emp route");
    init();
};

const viewAllEmpDep = () => {
    console.log("test view all emp dep route");
    init();
};

const viewAllRoles = () => {
    console.log("test view all roles route");
    init();
};

const addEmp = () => {
    console.log("test add emp route");
    init();
};

const addRole = () => {
    console.log("test add role route");
    init();
};

const updateEmpRole = () => {
    console.log("test update emp role route");
    init();
};

// initialize app
init();