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
    connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;
    console.log("\nItem ID : Product : Department : Price(USD) : OnHand");  

    
     for (i in res){
        console.log(res[i].IDNumber + ": " + res[i].Product + " : " + res[i].Department + " : " + res[i].Price + " : " +res[i].OnHand);
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
        connection.query("SELECT * FROM products WHERE ?", { IDNumber: item}, function(err, res) {
        if(err) throw err;
        
        let isEnough = parseInt(res[0].OnHand) - parseInt(answers.select);
        if (isEnough >=0){
            connection.query("UPDATE products SET ? WHERE ?", [{ OnHand: isEnough},
            {IDNumber:item}],function(err, res) {
                connection.end(function(err){
                    console.log("It's yours")
                });

            });  

        }

        else {console.log ("We don't have the amount of " + res[0].productName)" you need.";
        }
    });
});
}