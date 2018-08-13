
//
var BamazonDB = require("./bamazonDB");
var BamazonCLI = require("./cli")

//
var db = new BamazonDB();
var cli = new BamazonCLI();

//
function logInventoryToConsole(arr, cb) {
    arr.forEach(function(element) {
        console.log(
            [
                "---------------------", 
                "~ Item #" + element.item_id + " ~", 
                "Product Name: " + element.product_name, 
                "Price: " + element.price, 
                "Quantity In Stock: " + element.stock_quantity
            ].join("\n"))
    })
    cb();
}

//
function logInventoryDataToConsole(inventoryArray) {
    logInventoryToConsole(inventoryArray, initManagerPortal);
}

//
function viewProdForSale() {
    db.readBamazonDB("SELECT * FROM products", logInventoryDataToConsole);
}

//
function viewLowInventory() {
    db.readBamazonDB("SELECT * FROM products WHERE stock_quantity < 5", function(resp) {
        if (resp.length) {
            resp.forEach(function(element) {
            console.log(element.product_name);
            })
        } else {
            console.log("All inventory items are stocked...");
        }
        initManagerPortal();
    })
}

//
function inventoryHandler(resp) {
    var inventoryItems = [];
    resp.forEach(function(element) {
        inventoryItems.push(element.product_name);
    })
    cli.addToInventoryMenu(inventoryItems, db.updateBamazonDB, initManagerPortal);
}

//
function addToInventory() {
    db.readBamazonDB("SELECT product_name FROM products", inventoryHandler);
}

//
function addNewProduct() {
    cli.addNewItem(db.createBamazonDB, initManagerPortal);
}

//
var managerOpObj = {
    "View Products for Sale": viewProdForSale, 
    "View Low Inventory": viewLowInventory, 
    "Add to Inventory": addToInventory, 
    "Add New Product": addNewProduct, 
    "Close": db.closePortal
}

//
function evalMenuSelection (managerInput) {
    managerOpObj[managerInput]();
}

//
function initManagerPortal() {
    cli.offerManagerPortalMenu(evalMenuSelection);
}

initManagerPortal();