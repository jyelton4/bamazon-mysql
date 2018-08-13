
//
var inquirer = require("inquirer");

//
var BamazonCLI = function() {

    //
    this.offerCustomerPortalMenu = function(offerPortal) {
        inquirer
            .prompt([
                {
                    type: "list", 
                    message: "Welcome to Bamazon Mountain Shop--please select items below for purchase:", 
                    choices: ["View Inventory", "Close"], 
                    name: "portalActivity"
                } 
            ])
            .then(function(resp) {
                offerPortal(resp.portalActivity);
            })
    }, 
    
    //
    this.purchaseOrGoBack = (resp, func, func2) => {
        inquirer
            .prompt([
                {
                    type: "list", 
                    message: "Please make selection: ", 
                    choices: ["Select Item To Purchase", "Return To Menu"],
                    name: "userOperation"
                }
            ])
            .then(function(inquirerResponse) {
                if (inquirerResponse.userOperation === "Select Item To Purchase") {
                    func(resp);
                } else {
                    func2();
                }
            })
    }, 

    //
    this.chooseProduct = (cb) => {
        inquirer
            .prompt([
                {
                    type: "input", 
                    message: "Please enter the item number of the product you wish to purchase:", 
                    name: "productId"
                }, 
                {
                    type: "input", 
                    message: "Please enter the quantity of units:", 
                    name: "productUnits"
                }
            ])
            .then(function(resp) {
                cb([resp.productId], resp.productUnits);
            })
    }, 

    //
    // EVERYTHING BEFORE THIS: CUSTOMER, BELOW: MANAGER
    //

    //
    this.offerManagerPortalMenu = function(offerPortal) {
        inquirer
            .prompt([
                {
                    type: "list", 
                    message: "Please select: ", 
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Close"], 
                    name: "managerOperation"
                }
            ])
            .then(function(inquirerResponse) {
                offerPortal(inquirerResponse.managerOperation);
            })
    }, 

    this.addToInventoryMenu = function(inventoryArray, updateInventoryInDb, reopenPortal) {
        inquirer
            .prompt([
                {
                    type: "list", 
                    message: "Add stock to inventory for: ", 
                    choices: inventoryArray, 
                    name: "itemToAdd"
                }, 
                {
                    type: "input", 
                    message: "What quantity to restock?", 
                    name: "quantityToAdd"
                }
            ])
            .then(function(inquirerResponse) {
                updateInventoryInDb(
                    "UPDATE products SET stock_quantity = stock_quantity + " + inquirerResponse.quantityToAdd + " WHERE product_name = '" + inquirerResponse.itemToAdd + "'", () => {
                        console.log("Successfully restocked " + inquirerResponse.quantityToAdd + " of item: " + inquirerResponse.itemToAdd);
                        reopenPortal();
                    });
            })
    }, 

    this.addNewItem = (insertItemToDb, reopenPortal) => {
        inquirer
            .prompt([
                {
                    type: "input", 
                    message: "What is the name of the new product to add to inventory?", 
                    name: "newProductName"
                }, 
                {
                    type: "input", 
                    message: "What department manages the new product?", 
                    name: "newProductDept"
                }, 
                {
                    type: "input", 
                    message: "What is the price of the new product?", 
                    name: "newProductPrice"
                }, 
                {
                    type: "input", 
                    message: "What quantity of the new product to add to inventory?", 
                    name: "newProductQuantity"
                }
            ])
            .then(function(inquirerResponse) {
                insertItemToDb("products SET product_name = '" + inquirerResponse.newProductName + "', department_name = '" + inquirerResponse.newProductDept + "', price = '" + inquirerResponse.newProductPrice + "', stock_quantity = " + inquirerResponse.newProductQuantity, () => {
                    console.log("Added " + inquirerResponse.newProductName + " to inventory...");
                    reopenPortal();
                });
            })
    }, 

    //
    //// EVERYTHING BELOW: SUPERVISOR 
    //

    //
    this.offerSupervisorPortalMenu = (offerPortal) => {
        inquirer
            .prompt([
                {
                    type: "list", 
                    message: "Please select operation: ", 
                    choices: ["View Product Sales by Department", "Create New Department", "Close"], 
                    name: "supervisorOperation"
                }
            ])
            .then(function(inquirerResponse) {
                offerPortal(inquirerResponse.supervisorOperation);
            })
    }, 

    this.addNewDept = (insertDeptToDb, reopenPortal) => {
        inquirer
            .prompt([
                {
                    type: "input", 
                    message: "What is the department name to add?", 
                    name: "newDeptName"
                }, 
                {
                    type: "input", 
                    message: "What are over-head costs for the new department?", 
                    name: "newOverhead"
                }
            ])
            .then(function(inquirerResponse) {
                insertDeptToDb("departments SET department_name = '" + inquirerResponse.newDeptName + "', over_head_costs = '" + inquirerResponse.newOverhead + "'", () => {
                    console.log("Added " + inquirerResponse.newDeptName + " to departments...");
                    reopenPortal();
                })
            })
    }

}

module.exports = BamazonCLI;