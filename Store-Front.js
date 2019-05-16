var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "$ABati0602",
    database: "bamazon"
})

connection.connect(function(err){
    if (err){
        // throw stops the server and tells user what the error is
        throw err;
    }
    // ID for each connection, and tells you what ID user is connected to
    console.log("Connected as ID " + connection.threadId)

    displayProducts();
})

// functions

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err){
            throw err;
        }
        console.log("Welcome to My Store, Type The ID of the Product You Would Like To Purchase");

        for (var i = 0; i < res.length; i++){
            console.log(`--------------------------------------------------------------------------
                        Product name: ${res[i].product_name}
                        Item ID: ${res[i].item_id}
                        Department Name: ${res[i].department_name}
                        Price: ${res[i].price}
                        Stock: ${res[i].stock_quantity}
                        `)
        }
    askCustomer();   
    })
}

function askCustomer(){
    inquirer.prompt([
        {
            message: "Please Enter Product ID You Want to Purchase",
            name: "Id"
        },
        {
            message: "How Many Would You Like To Purchase?",
            name: "Quantity"
        }
    ]).then(function(res){
        findProduct(res.Id, res.Quantity)
    })
}
function findProduct(id, quantity){
    connection.query("SELECT * FROM products WHERE ?", {item_id: id}, function(err, res){
        if (err){
            throw err;
        }

        // parseINT turns string into integer
        quantity = parseInt(quantity)
        if (res[0].stock_quantity < 0){
            console.log("Sorry, We Don't Have That Many In Stock")
        }
        if (res[0].stock_quantity - quantity > 0){
            // processTransactions();
            console.log(res[0].stock_quantity - quantity)
            console.log("Thank You for your purchase. Your order total will be $" + (quantity * res[0].price).toFixed(2) + " dollars." + "\nThank you for shopping at Bamazon!");
        }
    })
}
// function processTransactions(id, quantity){
//     connection.query("UPDATE * FROM products WHERE ?", {item_id: id}, function(err, res){
//         if (err){
//             throw err;
//         }
//         var total = res[i].price * quantity;
//         console.log(total);
//     })
// }
