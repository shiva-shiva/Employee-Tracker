const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require('./app/connection')('EmployeeTrackerDB','shivamysql1364')


async function init(){
        const answers = await inquirer.prompt([
            {
                name:"manage",
                type:"list",
                message:"what would you like to do?",
                choices :["Add departments","Add roles","Add employees",
                "View departments","View roles","View employees","Update employee roles","Update employee managers",
                "View employees by manager","Delete departments","Delete roles", "Delete employees"]
            }
        ])

        switch(answers.manage){
            case "View departments":
                viewDepartment()
            break;
            case "View roles":
                viewRoles()
            break;
            case "View employees":
                viewEmployees()
            break;
            case "View employees by manager":
                viewEmployeesByManager()
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
        
    }
}
async function viewDepartment(){
    let choiceList = await db.query("select * from department");
    console.table('DEPARTMENT', choiceList);

}
async function viewRoles(){
    let choiceList = await db.query("select * from  role");
    console.table('ROLES', choiceList);
    init()
}
async function viewEmployees(){
    let choiceList = await db.query("select * from employee");
    console.table('EMPLOYEE', choiceList);
    init()
}
async function  viewEmployeesByManager(){
    let choiceList = await db.query("select * from employee");
    console.table('EMPLOYEE', choiceList);
    init()
}
async function  AddDepartments(){
     const answers = await inquirer.prompt([
         {  name:"Department", message:"Enter new Department:", type:"input"}
        ])
     await db.query("insert into department(`name`)value (?)",[answers.Department]);
     let choiceList= await db.query("select * from  department")
    console.table('Department', choiceList);
    init()
}
async function Addroles(){
    let choiceList = await db.query('SELECT id, name FROM department')
    const answers = await inquirer.prompt([
            { name: "roleName",type: "input", message: "Enter new role title:"},
            { name: "salaryNum",type: "input", message: "Enter role's salary:",
             validate: input => {if (!isNaN(input)) {return true;} return "Please enter a valid number."}
            },
            {  name: "roleDepartment",type: "list", message: "Choose the role's department:", choices: choiceList.map(obj => obj.name)}
       ])
    let depId = choiceList.find(obj => obj.name === answers.roleDepartment).id
    await db.query("insert into role(`title`,`salary`, `department_id`)value (?,?,?)",[answers.roleName, answers.salaryNum, depId]);
   console.table( `${answers.roleName} was added. Department: ${answers.roleDepartment}`);
   let addRole = await db.query("select * from role");
   console.table('ADD ROLE',addRole);
   init()
}

async function AddEmployees(){
    let choiceList = await db.query('SELECT id, title FROM role')
    let managers = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
    managers.unshift({ id: null, Manager: "None" });
    const answers = await inquirer.prompt([
        { name: "firstName",type: "input", message: "Enter new employee first name:"},
        { name: "lastName",type: "input", message: "Enter new employee last name:"},
        { name: "role",type: "list", message: "Choose the role's department:", choices: choiceList.map(obj => obj.title)},
        {name: "manager",type: "list", message: "Choose the employee's manager:", choices: managers.map(obj => obj.Manager)
        }
   ])
   let roleId = choiceList.find(obj => obj.title === answers.role).id
   let managerId = managers.find(obj => obj.Manager === answers.manager).id
   await db.query("insert into employee(`first_name`,`last_name`, `role_id`,`manager_id` )value (?,?,?,?)",[answers.firstName.trim(), answers.lastName.trim(), roleId, managerId]);
   console.table( `${answers.firstName} was added to the employee database!`);
   let addEmployees = await db.query("select * from employee");
   console.table('ADD EMPLOYEE',addEmployees);
   init()
}



init()