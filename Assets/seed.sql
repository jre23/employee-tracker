DROP DATABASE IF EXISTS employee_managementDB;
CREATE DATABASE employee_managementDB;
USE employee_managementDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30), -- to hold department name
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30), -- to hold role title
    salary DECIMAL, -- to hold role salary
    department_id INT, -- to hold reference to department role belongs to
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30), -- to hold employee first name
    last_name VARCHAR(30), -- to hold employee last name
    role_id INT, -- to hold reference to role employee has
    manager_id INT, -- to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager
    PRIMARY KEY (id)
);

INSERT INTO department(name) VALUES("Cool Department");

INSERT INTO role(title, salary, department_id) VALUES("Cool Person", "23000000.23", 230);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Joel", "Estrada", 23, 3);