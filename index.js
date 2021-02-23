const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require('./app/connection')('EmployeeTrackerDB','shivamysql1364')


async function init(){
    while( 1 ){
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
                    AddDepartments()
            break;
        
    }
}
}
async function viewDepartment(){
    let choiceList = await db.query("select * from department");
    console.table('DEPARTMENT', choiceList);

}
async function viewRoles(){
    let choiceList = await db.query("select * from  role");
    console.table('ROLES', choiceList);

}
async function viewEmployees(){
    let choiceList = await db.query("select * from employee");
    console.table('EMPLOYEE', choiceList);

}
async function  viewEmployeesByManager(){
    let choiceList = await db.query("select * from employee");
    console.table('EMPLOYEE', choiceList);

}
async function  AddDepartments(){
     const answers = await inquirer.prompt([
         {  name:"Department", message:"Enter new Department:", type:"input"}
        ])
     await db.query("insert into department(`name`)value (?)",[answers.Department]);
     let choiceList= await db.query("select * from  department")
    console.table('Department', choiceList);

}

init()