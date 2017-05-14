require("dotenv").config()
let password = process.env.password
let mysql = require("mysql");
let inquirer = require("inquirer");
//let Table = require('cli-table'); Add tables later

let connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: password,
	database: 'bamazon_db'
});

connection.connect(function(err) {
    if (err) throw err;
    inventory();
});

// Starts app, lists all items for sale

let inventory = function(){
    connection.query("SELECT * FROM product_name", function(err, res){
    if(err) throw err;
    console.log("\nItem ID : Product : Department : Price(USD) : Amount on Hand");  

    
     for (i in res){
        console.log(res[i].item_id + ": " + res[i].product_name + " : " + res[i].department_name + " : " + res[i].price + " : " +res[i].stock_quantity);
     }

    
    selectItem();

    });
};

//User selects by item #
let selectItem = function(){
        inquirer.prompt({
            name:"select",
            type:"input",
            message:"Which item would you like to purchase?"

        }).then(function (answers) {
        if (answers.select > 0){
        buy(answers.select);
        }
        else {
            inventory();
        }

    });
}
//User selects quantity they want
let buy = function(item){
    inquirer.prompt({
            name:"select",
            type:"input",
            message:"How many did you want?"
        }).then(function (answers) {
        connection.query("SELECT * FROM product_name WHERE ?", { item_id: item}, function(err, res) {
        if(err) throw err;
        
        let isEnough = parseInt(res[0].stock_quantity) - parseInt(answers.select);
        if (isEnough >=0){
            connection.query("UPDATE product_name SET ? WHERE ?", [{ stock_quantity: isEnough},
            {item_id:item}],function(err, res) {
                connection.end(function(err){
                    console.log("It's yours")
                });

            });  

        }

        else {console.log ("We don't have that much " + res[0].product_name);
        }
    });
});
}