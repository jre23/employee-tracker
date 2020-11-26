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
    choices: ["View All Departments", "View All Roles", "View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "Quit"],
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

const updateRoleQuestions = [{
        type: "list",
        message: "Who is the employee that you want to update the role for?",
        choices: managerChoices,
        name: "empChoiceRole"
    },
    {
        type: "list",
        message: "What is the employee's new role?",
        choices: roleChoices,
        name: "empNewRole"
    }
];

const viewEmpDeptQuestions = [{
    type: "list",
    message: "What department do you want to see all of the employees in?",
    choices: deptChoices,
    name: "empDeptChoice"
}];

const viewEmpManagerQuestions = [{
    type: "list",
    message: "What manager do you want to see all of the employees who work under?",
    choices: managerChoices,
    name: "empManagerChoice"
}];

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
            case "View All Employees By Manager":
                viewAllEmpManager();
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
            case "Update Employee Manager":
                updateEmpManager();
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
    console.log("test view all emp dep route\r\n");
    inquirer.prompt(viewEmpDeptQuestions).then(res => {
        connection.query(
            "SELECT first_name, last_name FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department on department_id = department.id WHERE department.name = ?", [res.empDeptChoice], (err, res) => {
                if (err) throw err;
                console.log(res);
            });
    }).then(() => {
        init();
    }).catch((e) => {
        console.log(e)
    });
};

const viewAllEmpManager = () => {
    console.log("test view all emp manager route\r\n");
    inquirer.prompt(viewEmpManagerQuestions).then(res => {
        let firstName = res.empManagerChoice.split(" ")[0];
        let lastName = res.empManagerChoice.split(" ")[1];
        connection.query(
            "SELECT t1.first_name, t1.last_name FROM employee t1 INNER JOIN employee t2 ON (t1.manager_id = t2.id) WHERE (t2.first_name = ? AND t2.last_name = ?)", [
                firstName,
                lastName
            ], (err, res) => {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("There are no employees who work under the given employee.");
                } else {
                    console.log(res);
                }
            });
    }).then(() => {
        init();
    }).catch((e) => {
        console.log(e)
    });
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
                        deptChoices.length = 0;
                        deptIds.length = 0;
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
                        roleChoices.length = 0;
                        roleIds.length = 0;
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
                        managerChoices.length = 0;
                        managerIds.length = 0;
                        for (let i = 0; i < res.length; i++) {
                            let managerName = res[i].first_name + " " + res[i].last_name;
                            let managerId = res[i].id;
                            let newObj = {
                                [managerName]: managerId
                            }
                            managerChoices.push(managerName);
                            managerIds.push(newObj);
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
        init();
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
                    department_id: findId(deptIds, res.roleDept)
                }, (err, res) => {
                    if (err) throw err;

                }
            );
        }).then(() => {
            checkLength("role");
            init();
        }).catch((e) => {
            console.log(e)
        });
    }
};


const updateEmpRole = () => {
    console.log("test update emp role route");
    inquirer.prompt(updateRoleQuestions).then(res => {
        let firstName = res.empChoiceRole.split(" ")[0];
        let lastName = res.empChoiceRole.split(" ")[1];
        console.log(firstName + " " + lastName + " test first name last name");
        connection.query(
            "UPDATE employee SET ? WHERE ? AND ?", [{
                role_id: getRoleId(res.empNewRole)
            }, {
                first_name: firstName
            }, {
                last_name: lastName
            }], (err, res) => {
                if (err) throw err;
            }
        );
    }).then(() => {
        checkLength("employee");
        init();
    }).catch((e) => {
        console.log(e)
    });
}

const updateEmpManager = () => {



};

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
                    role_id: findId(roleIds, res.empRole),
                    manager_id: findId(managerIds, res.empManager)
                }, (err, res) => {
                    if (err) throw err;
                }
            );
        }).then(() => {
            checkLength("employee");
            init();
        }).catch((e) => {
            console.log(e)
        });
    }
};

const findId = (arrayName, arrayParam) => {
    if (arrayParam === "None") {
        return null;
    } else {
        let returnThisId;
        arrayName.forEach((value, index) => {
            for (let key in value) {
                if (arrayParam === key) {
                    returnThisId = value[key];
                }
            }
        });
        return returnThisId;
    }
}