const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_managementDB"
});

const roleChoices = [];
const employeeChoices = [];
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
const userToDo = [{
    type: "list",
    message: "What would you like to do?",
    choices: ["View All Departments", "View All Roles", "View All Employees", "View All Employees By Department", "View All Employees By Manager", "View Total Utilized Budget By Department", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "Delete Department", "Delete Role", "Delete Employee", "Quit"],
    name: "userToDoRes"
}];

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
        choices: employeeChoices,
        name: "empManager"
    },
];

const updateRoleQuestions = [{
        type: "list",
        message: "Who is the employee that you want to update the role for?",
        choices: employeeChoices,
        name: "empChoiceRole"
    },
    {
        type: "list",
        message: "What is the employee's new role?",
        choices: roleChoices,
        name: "empNewRole"
    }
];

const updateManagerQuestions = [{
        type: "list",
        message: "Who is the employee that you want to update the manager for?",
        choices: employeeChoices,
        name: "empChoiceManager"
    },
    {
        type: "list",
        message: "Who is the employee's new manager?",
        choices: employeeChoices,
        name: "empNewManager"
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
    choices: employeeChoices,
    name: "empManagerChoice"
}];

const viewBudgetDepQuestions = [{
    type: "list",
    message: "What department do you want to see the total utilized budget for?",
    choices: deptChoices,
    name: "budgetDepChoice"
}];

const deleteDeptQuestions = [{
    type: "list",
    message: "What department do you want to delete?",
    choices: deptChoices,
    name: "delDeptChoice"
}];

const deleteRoleQuestions = [{
    type: "list",
    message: "What role do you want to delete?",
    choices: roleChoices,
    name: "delRoleChoice"
}];

const deleteEmpQuestions = [{
    type: "list",
    message: "Who is the employee that you want to delete?",
    choices: employeeChoices,
    name: "delEmpChoice"
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
            case "View Total Utilized Budget By Department":
                viewBudgetDep();
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
            case "Delete Department":
                deleteDept();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            case "Quit":
                connection.end();
                break;
        }
    });
}

const viewAllDep = () => {
    connection.query("SELECT id, name as department FROM department", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("\r\nThere are no departments added yet!\r\n");
            init();
        } else {
            console.table(res);
            init();
        }
    });
};

const viewAllRoles = () => {
    connection.query("SELECT id, title as role, salary, department_id FROM role", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("\r\nThere are no roles added yet!\r\n");
            init();
        } else {
            console.table(res);
            init();
        }
    });
};

const viewAllEmp = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title as role, d.name AS department, r.salary, concat(e2.first_name, SPACE(1), e2.last_name) AS manager FROM employee e LEFT JOIN employee e2 ON (e.manager_id = e2.id OR e.manager_id = null) LEFT JOIN role r ON (e.role_id = r.id or e.role_id = null) LEFT JOIN department d ON (r.department_id = d.id OR r.department_id = null)", (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log("\r\nThere are no employees added yet!\r\n");
            init();
        } else {
            console.table(res);
            init();
        }
    });
};

const viewAllEmpDep = () => {
    if (deptChoices.length === 0) {
        console.log("\r\nThere are no departments added yet!\r\n");
        init();
    } else {
        inquirer.prompt(viewEmpDeptQuestions).then(res => {
            let keepEmpDeptChoice = res.empDeptChoice;
            connection.query(
                "SELECT first_name, last_name FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON department_id = department.id WHERE department.name = ?", [res.empDeptChoice], (err, res) => {
                    if (err) throw err;
                    if (res.length === 0) {
                        console.log("\r\n\r\nThere are no employees added yet!\r\n");
                        conLogRN(5);
                    } else {
                        res.unshift({
                            "department": keepEmpDeptChoice,
                            "first_name": "X",
                            "last_name": "X"
                        })
                        console.log("\r\n");
                        console.table(res);
                        conLogRN(res.length);
                    }
                });
        }).then(() => {
            init();
        }).catch((e) => {
            console.log(e)
        });
    }
};

const viewAllEmpManager = () => {
    inquirer.prompt(viewEmpManagerQuestions).then(res => {
        let firstName = res.empManagerChoice.split(" ")[0];
        let lastName = res.empManagerChoice.split(" ")[1];
        connection.query(
            "SELECT t1.first_name, t1.last_name FROM employee t1 INNER JOIN employee t2 ON (t1.manager_id = t2.id) WHERE (t2.first_name = ? AND t2.last_name = ?)", [
                firstName,
                lastName
            ], (err, res) => {
                if (err) throw err;
                console.log("\r\n");
                if (res.length === 0) {
                    console.log("There are no employees who work under the chosen employee.\r\n");
                    conLogRN(5);
                } else {
                    res.unshift({
                        "manager": "    -->",
                        "first_name": firstName,
                        "last_name": lastName
                    })
                    console.table(res);
                    conLogRN(res.length);
                }
            });
    }).then(() => {
        init();
    }).catch((e) => {
        console.log(e)
    });
};

const conLogRN = length => {
    if (length <= 4) {
        for (let i = 0; i < length; i++) {
            console.log("\r\n");
        }
    } else if (length > 4) {
        for (let i = 0; i < 4; i++) {
            console.log("\r\n");
        }
    }
}

const checkLength = async table => {
    let query = "";
    switch (table) {
        case "department":
            query = "SELECT * FROM department";
            break;
        case "role":
            query = "SELECT * FROM role";
            break;
        case "employee":
            query = "SELECT * FROM employee";
            break;
        default:
            connection.end();
    }
    connection.query(query,
        (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
                if (table === "employee") {
                    employeeChoices.push("None");
                }
                return;
            } else {
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
                        employeeChoices.length = 0;
                        managerIds.length = 0;
                        for (let i = 0; i < res.length; i++) {
                            let managerName = res[i].first_name + " " + res[i].last_name;
                            let managerId = res[i].id;
                            let newObj = {
                                [managerName]: managerId
                            }
                            employeeChoices.push(managerName);
                            managerIds.push(newObj);
                        };
                        employeeChoices.push("None");
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
    employeeChoices.pop();
    if (employeeChoices.length === 0) {
        console.log("\r\nThere are no employees added yet!\r\n");
        init();
    } else {
        inquirer.prompt(updateRoleQuestions).then(res => {
            let firstName = res.empChoiceRole.split(" ")[0];
            let lastName = res.empChoiceRole.split(" ")[1];
            console.log(firstName + " " + lastName + " test first name last name");
            connection.query(
                "UPDATE employee SET ? WHERE ? AND ?", [{
                    role_id: findId(roleIds, res.empNewRole)
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
}

const updateEmpManager = () => {
    if (employeeChoices.length === 1) {
        console.log("\r\nThere are no employees added yet!\r\n");
        init();
    } else {
        inquirer.prompt(updateManagerQuestions).then(res => {
            let firstName = res.empChoiceManager.split(" ")[0];
            let lastName = res.empChoiceManager.split(" ")[1];
            console.log(firstName + " " + lastName + " test first name last name");
            if (firstName === "None") {
                console.log("None was chosen.");
            } else {
                connection.query(
                    "UPDATE employee SET ? WHERE ? AND ?", [{
                        manager_id: findId(managerIds, res.empNewManager)
                    }, {
                        first_name: firstName
                    }, {
                        last_name: lastName
                    }], (err, res) => {
                        if (err) throw err;
                    }
                );
            }
        }).then(() => {
            checkLength("employee");
            init();
        }).catch((e) => {
            console.log(e)
        });
    }
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

const deleteDept = () => {
    if (deptChoices.length === 0) {
        console.log("\r\nThere are no departments added yet!\r\n");
        init();
    } else {
        deptChoices.push("None");
        inquirer.prompt(deleteDeptQuestions).then(res => {
            if (res.delDeptChoice === "None") {
                console.log("\r\nNone selected.\r\n");
            } else {
                connection.query(
                    "DELETE FROM department WHERE ?", {
                        name: res.delDeptChoice,
                    }, (err, res) => {
                        if (err) throw err;
                    });
            }
        }).then(() => {
            checkLength("department");
            init();
        }).catch((e) => {
            console.log(e)
        });
    }
};

const deleteRole = () => {
    if (roleChoices.length === 0) {
        console.log("\r\nThere are no roles added yet!\r\n");
        init();
    } else {
        roleChoices.push("None");
        inquirer.prompt(deleteRoleQuestions).then(res => {
            if (res.delRoleChoice === "None") {
                console.log("\r\nNone selected.\r\n");
            } else {
                connection.query(
                    "DELETE FROM role WHERE ?", {
                        title: res.delRoleChoice,
                    }, (err, res) => {
                        if (err) throw err;
                    });
            }
        }).then(() => {
            checkLength("role");
            init();
        }).catch((e) => {
            console.log(e)
        });
    }
};

const deleteEmployee = () => {
    inquirer.prompt(deleteEmpQuestions).then(res => {
        let firstName = res.delEmpChoice.split(" ")[0];
        let lastName = res.delEmpChoice.split(" ")[1];
        if (firstName === "None") {
            console.log("None was chosen.\r\n");
        } else {
            connection.query(
                "DELETE FROM employee WHERE ? AND ?", [{
                    first_name: firstName
                }, {
                    last_name: lastName
                }], (err, res) => {
                    if (err) throw err;
                }
            );
        }
    }).then(() => {
        checkLength("employee");
        init();
    }).catch((e) => {
        console.log(e)
    });
};

const viewBudgetDep = () => {
    inquirer.prompt(viewBudgetDepQuestions).then(res => {
        let keepEmpDeptChoice = res.budgetDepChoice;
        connection.query(
            "SELECT sum(salary) as total_budget FROM role INNER JOIN employee ON role_id = role.id INNER JOIN department ON department_id = department.id WHERE department.name = ?", [res.budgetDepChoice], (err, res) => {
                if (err) throw err;
                let totalBudget = res[0].total_budget;
                let newResponse = [{
                    "department": keepEmpDeptChoice,
                    "total_budget": totalBudget
                }];
                console.log("\r\n");
                console.table(newResponse);
                conLogRN(5);
            });
    }).then(() => {
        init();
    }).catch((e) => {
        console.log(e)
    });
};