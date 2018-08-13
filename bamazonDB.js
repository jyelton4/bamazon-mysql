//
var mysql = require("mysql");
// var BamazonCLI = require("./cli.js");

//
var connection = mysql.createConnection({
    host: "localhost", 

    port: 8889, 

    user: "root", 

    password: "", 

    database: "bamazonDB"
});

//
var BamazonDB = function() {

    //
    this.createBamazonDB = (query, cb) => {
        console.log("Inserting new record...");
        connection.query("INSERT INTO " + query, (err, res) => {
            if (err) throw "Failed to insert new record...";
            console.log(res.affectedRows + " products inserted!\n")
            cb();
        });
    }, 

    //
    this.readBamazonDB = (query, cb) => {
        console.log("Reading from database...");
        connection.query(query, (err, resp) => {
                if (err) throw "Failed to read from database...";
                cb(resp);
        });
    }, 
    
    //
    this.updateBamazonDB = (updateStmt, cb) => {
        console.log("Updating database...");
        connection.query(updateStmt, (err, resp) => {
            if (err) throw "Failed to update database...";
            cb();
        });
    }, 

    //
    this.deleteBamazonDB = (queryParamstoDelete) => {
        console.log("Deleting from database...");
        connection.query("DELETE FROM product WHERE ? = ?", queryParamstoDelete, (err, resp) => {
            if (err) throw "Failed to delete from database...";
            console.log(resp.affectedRows + " rows deleted!\n");
        });
    }, 

    this.closePortal = () => {
        connection.end();
        return
    }

}

module.exports = BamazonDB;