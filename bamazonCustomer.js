
//
var BamazonDB = require("./bamazonDB.js");
var BamazonCLI = require("./cli.js")

//
var db = new BamazonDB();
var cli = new BamazonCLI();

//
function confirmPurchase(itemId) {
    db.readBamazonDB(
    {
        sql: "SELECT * FROM products WHERE item_id = ?", 
        values: itemId
    }, (resp) => {
        logInventoryToConsole(resp, function() {
            console.log("Thank you for your purchase!");
            initCustomerPortal();
        })
    });
}

//
function updateInventory(id, quantityDiff) {
    db.updateBamazonDB(
        "UPDATE products SET stock_quantity = " + quantityDiff + ", product_sales = (product_sales + price) WHERE item_id = " + id, () => {
        confirmPurchase(id);
    })
}

//
function purchaseItem() {
    cli.chooseProduct(inventoryCheck);
}

//
function logInventoryToConsole(arr, cb) {
    arr.forEach(function(element) {
        console.log(
            [
                "---------------------", 
                "~ Item #" + element.item_id + " ~", 
                "Product Name: " + element.product_name, 
                "Price: " + element.price, 
            ].join("\n"))
    })
    cb();
}

//
function checkItemInInventory (id, quantityRequested, quantityInStock) {        
    if (quantityInStock - quantityRequested >= 0) {
        updateInventory(id, (quantityInStock - quantityRequested));
    } else {
        console.log("Insufficient quantity!");
        initCustomerPortal();
    }
}

//
function inventoryCheck(id, quantityRequested) {
    db.readBamazonDB( 
        {
            sql: "SELECT * FROM products WHERE item_id = ?", 
            values: id
        }, (resp) => {
            var quantityInStock = resp[0].stock_quantity;
            checkItemInInventory(id, quantityRequested, quantityInStock);
        }
    ) 
}

//
function purchaseMenu(resp) {
    logInventoryToConsole(resp, function() {
        cli.purchaseOrGoBack(resp, purchaseItem, initCustomerPortal);
    })
}

//
function getInventoryFromDb() {
    db.readBamazonDB("SELECT * FROM products", purchaseMenu);
}

//
function evalMenuSelection (customerInput) {
    if (customerInput === "Close") {
        db.closePortal();
    } else {
        getInventoryFromDb();
    }
}

//
function initCustomerPortal() {
    cli.offerCustomerPortalMenu(evalMenuSelection);
}

initCustomerPortal();