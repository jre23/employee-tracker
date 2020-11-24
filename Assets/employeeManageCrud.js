const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_managementDB"
});

const roleChoices = [];
const managerChoices = [];
const deptChoices = [];
const deptIds = [];
const roleIds = [];
const managerIds = [];

connection.connect(err => {
    if (err) throw err;
    console.log("Connection successful!");
    checkLength("department");
    checkLength("role");
    checkLength("employee");
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
    choices: ["View All Departments", "View All Roles", "View All Employees", "View All Employees By Department", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"],
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

const addDeptQuestions = [{
    type: "input",
    message: "What is the department name?",
    name: "deptName",
    validate: stringValidate
}]

const addRoleQuestions = [{
        type: "input",
        message: "What is the name of the role?",
        name: "roleName",
        validate: stringValidate
    },
    {
        type: "input",
        message: "What is the salary for this role?",
        name: "roleSalary",
        validate: numberValidate
    },
    {
        type: "list",
        message: "What department does this role belong to?",
        choices: deptChoices,
        name: "roleDept"
    },
];

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
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmp();
                break;
            case "Add Department":
                addDept();
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
        if (res.length === 0) {
            console.log("There are no departments added yet!\r\n");
            init();
        } else {
            console.log(res);
            init();
        }
    });
};

const viewAllRoles = () => {
    console.log("test view all roles route");
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("There are no roles added yet!\r\n");
            init();
        } else {
            console.log(res);
            init();
        }
    });
};

const viewAllEmp = () => {
    console.log("test view all emp route");
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("There are no employees added yet!\r\n");
            init();
        } else {
            console.log(res);
            init();
        }
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
                if (table === "employee") {
                    managerChoices.push("None");
                }
                return;
            } else {
                console.log("\r\ntest false checkLength " + table);
                switch (table) {
                    case "department":
                        for (let i = 0; i < res.length; i++) {
                            let departmentName = res[i].name;
                            let departmentId = res[i].id;
                            let newObj = {
                                [departmentName]: departmentId
                            }
                            deptChoices.push(departmentName);
                            deptIds.push(newObj);
                        };
                        break;
                    case "role":
                        for (let i = 0; i < res.length; i++) {
                            let roleName = res[i].title;
                            let roleId = res[i].id;
                            let newObj = {
                                [roleName]: roleId
                            }
                            roleChoices.push(roleName);
                            roleIds.push(newObj);
                        };
                        break;
                    case "employee":
                        for (let i = 0; i < res.length; i++) {
                            managerChoices.push(res[i].first_name + " " + res[i].last_name)
                        };
                        managerChoices.push("None");
                        break;
                }
            }
        });
}

const addDept = () => {
    inquirer.prompt(addDeptQuestions).then(res => {
        connection.query(
            "INSERT INTO department SET ?", {
                name: res.deptName,
            }, (err, res) => {
                if (err) throw err;
            });
    }).then(() => {
        checkLength("department");
        init()
    }).catch((e) => {
        console.log(e)
    });
}

const addRole = () => {
    console.log("test add role route");
    if (deptChoices.length === 0) {
        checkDept = true;
    } else {
        checkDept = false;
    }
    if (checkDept) {
        console.log("Please add a department before adding any roles!\r\n");
        init();
    } else {
        inquirer.prompt(addRoleQuestions).then(res => {
            connection.query(
                "INSERT INTO role SET ?", {
                    title: res.roleName,
                    salary: res.roleSalary,
                    department_id: getDeptId(res.roleDept)
                }, (err, res) => {
                    if (err) throw err;
                    init();
                }
            );
        }).catch((e) => {
            console.log(e)
        });
    }
};

const getDeptId = (department) => {
    let returnThisId;
    deptIds.forEach((value, index) => {
        for (let key in value) {
            if (department === key) {
                returnThisId = value[key];
            }
        }
    });
    return returnThisId;
}

const addEmp = () => {
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
    if (checkDept) {
        console.log("Please add a department before adding any employees!\r\n");
        init();
    } else if (checkRole) {
        console.log("Please add a role before adding any employees!\r\n");
        init();
    } else {
        inquirer.prompt(addEmpQuestions).then(res => {
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: res.firstName,
                    last_name: res.lastName,
                    role_id: getRoleId(res.empRole),
                    manager_id: 33 // make a new function that returns value depending on employee manager
                }, (err, res) => {
                    if (err) throw err;
                    init();
                }
            );
        }).catch((e) => {
            console.log(e)
        });
    }
};

const managerId = manager => {

}

const getRoleId = (role) => {
    let returnThisId;
    roleIds.forEach((value, index) => {
        for (let key in value) {
            if (role === key) {
                returnThisId = value[key];
            }
        }
    });
    return returnThisId;
}

const updateEmpRole = () => {
    console.log("test update emp role route");
    init();
};