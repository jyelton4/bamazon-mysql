
//
var BamazonDB = require("./bamazonDB.js");
var BamazonCLI = require("./cli.js")

//
var cTable = require("console.table");

//
var db = new BamazonDB();
var cli = new BamazonCLI();

var salesGroupedByDept = "SELECT dept.department_id department_id, dept.department_name department_name, dept.over_head_costs over_head_costs, sum(prod.product_sales) product_sales, (sum(prod.product_sales) - dept.over_head_costs) total_profit  FROM departments dept JOIN products prod ON prod.department_name = dept.department_name GROUP BY department_id, department_name";

//
var cTableArray = [];

//
function formatSalesByDeptData(arr) {
    arr.forEach(function(element) {
        cTableArray.push(
            {
                "department_id": element.department_id, 
                "department_name": element.department_name, 
                "over_head_costs": element.over_head_costs, 
                "product_sales": element.product_sales, 
                "total_profit": element.total_profit
            })
    })
    console.table(cTableArray);
    initSupervisorPortal();
}

//
function viewSalesByDept() {
    db.readBamazonDB(salesGroupedByDept, function(response) {
        formatSalesByDeptData(response);
    });
}

//
function createNewDept() {
    cli.addNewDept(db.createBamazonDB, initSupervisorPortal);
}

//
var supervisorOpObj = {
    "View Product Sales by Department": viewSalesByDept, 
    "Create New Department": createNewDept, 
    "Close": db.closePortal
}

//
function evalMenuSelection(supervisorInput) {
    supervisorOpObj[supervisorInput]();
}

//
function initSupervisorPortal() {
    cli.offerSupervisorPortalMenu(evalMenuSelection);
}

//
initSupervisorPortal();