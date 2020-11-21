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
// validate function for string responses
const stringValidate = async input => {
    if (input.trim() === "" || !isNaN(input.trim())) {
        return "Please enter a valid response.";
    } else {
        return true;
    }
}
// validate function for number responses
const numberValidate = async input => {
    if (input.trim() === "" || isNaN(input.trim())) {
        return "Please enter a valid number.";
    } else {
        return true;
    }
}
// array holding questions to determine if user wants to view, add, remove, or update
// mvp
const userToDo = [{
    type: "list",
    message: "Hello and welcome to the Employee Manager app! What would you like to do?",
    choices: ["View All Departments", "View All Roles", "View All Employees", "View All Employees By Department", "Add Employee", "Add Role", "Update Employee Role", "Quit"],
    name: "userToDoRes"
}];

// bonus
// const userToDo = [{
//     type: "list",
//     message: "Hello and welcome to the Employee Manager app! What would you like to do?",
//     choices: ["View All Employees", "View All Departments", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "Add Role", "Remove Role", "Remove Department"],
//     name: "userToDoRes"
// }];

const addEmpQuestions = [{
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
        validate: stringValidate
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
        validate: stringValidate
    },
    {
        type: "list",
        message: "What is the employee's role?",
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"],
        name: "empRole"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: ["Johnny Bravo", "Homer Simpson", "Ned Flanders", "Stewie Griffin", "Jisoo Kim", "Jennie Kim", "Roseanne Park", "Lalisa Manoban"],
        name: "empManager"
    },
];

const init = () => {
    inquirer.prompt(userToDo).then(res => {
        switch (res.userToDoRes) {
            case "View All Departments":
                viewAllDep();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmp();
                break;
            case "View All Employees By Department":
                viewAllEmpDep();
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

const viewAllDep = () => {
    console.log("test view all dep route");
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.log(res);
        init();
    });
};

const viewAllRoles = () => {
    console.log("test view all roles route");
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.log(res);
        init();
    });
};

const viewAllEmp = () => {
    console.log("test view all emp route");
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.log(res);
        init();
    });
};

const viewAllEmpDep = () => {
    console.log("test view all emp dep route");
    init();
};

const addEmp = () => {
    console.log("test add emp route");
    inquirer.prompt(addEmpQuestions).then(res => {
        connection.query(
            "INSERT INTO employee SET ?", {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: // make a new function that returns value depending on employee role
                    23,
                manager_id: 33 // make a new function that returns value depending on employee manager
            }, (err, res) => {
                if (err) throw err;
                console.log(res);
                init();
            }
        );
    });
    // init();
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