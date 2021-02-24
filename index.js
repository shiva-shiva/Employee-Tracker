const inquirer = require('inquirer');
const cTable = require('console.table');
var figlet = require('figlet');

const db = require('./app/connection')('EmployeeTrackerDB', 'shivamysql1364')


async function init() {
    const answers = await inquirer.prompt([
        {
            name: "manage",
            type: "list",
            message: "what would you like to do?",
            choices: ["Add departments", "Add roles", "Add employees",
                "View departments", "View roles", "View employees", "Update employee roles", "Delete departments", "Delete roles", "Delete employees","Update Roles"]
        }
    ])

    switch (answers.manage) {
        case "View departments":
            viewDepartment()
            break;
        case "View roles":
            viewRoles()
            break;
        case "View employees":
            viewEmployees()
            break;
        case "Add departments":
            AddDepartments()
            break;
        case "Add roles":
            Addroles()
            break;
        case "Add employees":
            AddEmployees()
            break;
        case "Update employee roles":
            UpdateEmployeeRoles()
            break;
        case "Delete departments":
            DeleteDepartments()
            break;
        case "Delete departments":
            DeleteDepartments()
            break;
        case "Delete employees":
            DeleteEmployee()
            break;
        case "Delete roles":
            DeleteRole()
            break;
        case "Update Roles":
            UpdateRoles()
        break;
    }
}
async function viewDepartment() {
    let choiceList = await db.query("select * from department");
    console.table('DEPARTMENT', choiceList);
    init()
}
async function viewRoles() {
    let choiceList = await db.query("select * from  role");
    console.table('ROLES', choiceList);
    init()
}
async function viewEmployees() {
    let choiceList = await db.query("select * from employee");
    console.table('EMPLOYEE', choiceList);
    init()
}
async function AddDepartments() {
    const answers = await inquirer.prompt([
        { name: "Department", message: "Enter new Department:", type: "input" }
    ])
    await db.query("insert into department(`name`)value (?)", [answers.Department]);
    let choiceList = await db.query("select * from  department")
    console.table('Department', choiceList);
    init()
}
async function Addroles() {
    let choiceList = await db.query('SELECT id, name FROM department')
    const answers = await inquirer.prompt([
        { name: "roleName", type: "input", message: "Enter new role title:" },
        {
            name: "salaryNum", type: "input", message: "Enter role's salary:",
            validate: input => { if (!isNaN(input)) { return true; } return "Please enter a valid number." }
        },
        { name: "roleDepartment", type: "list", message: "Choose the role's department:", choices: choiceList.map(obj => obj.name) }
    ])
    let depId = choiceList.find(obj => obj.name === answers.roleDepartment).id
    await db.query("insert into role(`title`,`salary`, `department_id`)value (?,?,?)", [answers.roleName, answers.salaryNum, depId]);
    console.table(`${answers.roleName} was added. Department: ${answers.roleDepartment}`);
    let addRole = await db.query("select * from role");
    console.table('ADD ROLE', addRole);
    init()
}

async function AddEmployees() {
    let choiceList = await db.query('SELECT id, title FROM role')
    let managers = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
    managers.unshift({ id: null, Manager: "None" });
    const answers = await inquirer.prompt([
        { name: "firstName", type: "input", message: "Enter new employee first name:" },
        { name: "lastName", type: "input", message: "Enter new employee last name:" },
        { name: "role", type: "list", message: "Choose the role's department:", choices: choiceList.map(obj => obj.title) },
        {
            name: "manager", type: "list", message: "Choose the employee's manager:", choices: managers.map(obj => obj.Manager)
        }
    ])
    let roleId = choiceList.find(obj => obj.title === answers.role).id
    let managerId = managers.find(obj => obj.Manager === answers.manager).id
    console.log(roleId);
    console.log(managerId);
    await db.query("insert into employee(`first_name`,`last_name`, `role_id`,`manager_id` ) value (?,?,?,?)", [answers.firstName.trim(), answers.lastName.trim(), roleId, managerId]);
    console.table(`${answers.firstName} was added to the employee database!`);
    let addEmployees = await db.query("select * from employee");
    console.table('ADD EMPLOYEE', addEmployees);
    init()
}
async function UpdateRoles() {
    
    let roles = await db.query('SELECT id, title FROM role');
    let departments = await db.query('SELECT id, name FROM department');
    const answers = await inquirer.prompt([
        { name: "roleName", type: "list", message: "Update which role?", choices: roles.map(obj => obj.title) },
        { name: "salaryNum", type: "input", message: "Enter role's salary:" },
        { name: "roleDepartment", type: "list", message: "Choose the role's department:", choices: departments.map(obj => obj.name) }
    ])
    let depID = departments.find(obj => obj.name === answers.roleDepartment).id
    let roleID = roles.find(obj => obj.title === answers.roleName).id
    db.query("UPDATE role SET title=?, salary=?, department_id=? WHERE id=?", [answers.roleName, answers.salaryNum, depID, roleID]);
    console.log("\x1b[32m", `${answers.roleName} was updated.`);
    init();
}

async function UpdateEmployeeRoles() {
    let roles = await db.query('SELECT id, title FROM role');
    //let departments = await db.query('SELECT id, name FROM department');
    const answers = await inquirer.prompt([
        { name: "Name", type: "input", message: "Enter first name:"},
        { name: "family", type: "input", message: "Enter family name:" },
        { name: "role", type: "list", message: "Choose the role:", choices: roles.map(obj => obj.title) }
    ])
    let roleID = roles.find(obj => obj.title === answers.role).id
    db.query("UPDATE employee SET role_id=? WHERE first_name=? and last_name=?", [roleID, answers.Name, answers.family]);
    console.log("\x1b[32m", `${answers.Name} ${answers.family} role was updated to ${answers.role} .`);
    init();
}




async function DeleteDepartments() {
    let departments = await db.query('SELECT id, name FROM department');
    const answers = await inquirer.prompt([
        { name: "depName", type: "list", message: "Select Department", choices: departments.map(obj => obj.name) }
    ])
    let depId = departments.find(obj => obj.name === answers.depName).id
    db.query("DELETE FROM department WHERE id=?", depId);
    console.log("\x1b[32m", `${answers.depName} was delete.`);
    let department = await db.query("select * from department");
    console.table("\n", 'DEPARTMENT', department);
    init()
}
async function DeleteEmployee() {
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    const answers = await inquirer.prompt([
        { name: "employeeName", type: "list", message: " which employee would you like to remove?", choices: employees.map(obj => obj.name) }
    ])
    let deleteEmployee = employees.find(obj => obj.name === answers.employeeName).id;
    db.query("DELETE FROM employee WHERE id=?", deleteEmployee);
    console.log("\x1b[32m", `${answers.employeeName} was removed`);
    init()
};
async function DeleteRole() {
    let roles = await db.query('SELECT id, title FROM role');
    const answers = await inquirer.prompt([
        { name: "roleName", type: "list", message: "Remove which role?", choices: roles.map(obj => obj.title) }
    ])
    let noMoreRole = roles.find(obj => obj.title === answers.roleName);
    db.query("DELETE FROM role WHERE id=?", noMoreRole.id);
    console.log("\x1b[32m", `${answers.roleName} was removed.`);
    init()
};


async function start() {
    figlet('Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(`\n\n${data}\n\n\n`)
        init()
    });
}
start()
