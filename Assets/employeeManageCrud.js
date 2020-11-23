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
    checkLength("department");
    checkLength("role");
    init();
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
    message: "What would you like to do?",
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
// "Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"
const roleChoices = [];

const managerChoices = ["Johnny Bravo", "Homer Simpson", "Ned Flanders", "Stewie Griffin", "Jisoo Kim", "Jennie Kim", "Roseanne Park", "Lalisa Manoban"];

const deptChoices = [];

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
        choices: roleChoices,
        name: "empRole"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: managerChoices,
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

const checkLength = async table => {
    connection.query(`SELECT * FROM ${table}`,
        (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
                console.log("\r\ntest true checkLength " + table);
                return;
            } else {
                console.log("\r\ntest false checkLength " + table);
                if (table === "department") {
                    for (let i = 0; i < res.length; i++) {
                        deptChoices.push(res[i].name)
                    }
                } else if (table === "role") {
                    for (let i = 0; i < res.length; i++) {
                        roleChoices.push(res[i].name)
                    }
                }
            }
        });
}

const addEmp = async () => {
    let checkDept;
    let checkRole;
    if (deptChoices.length === 0) {
        checkDept = true;
    } else {
        checkDept = false;
    }
    if (roleChoices.length === 0) {
        checkRole = true;
    } else {
        checkRole = false;
    }
    console.log(checkDept + " test checkDept");
    console.log(checkDept + " test checkRole");
    if (checkDept) {
        console.log("Please add a department before adding any employees!\r\n");
        init();
    } else if (checkRole) {
        console.log("Please add a role before adding any employees!\r\n");
        init();
    } else {
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
    }
};

const managerId = person => {

}

const addRole = () => {
    console.log("test add role route");
    init();
};

const updateEmpRole = () => {
    console.log("test update emp role route");
    init();
};