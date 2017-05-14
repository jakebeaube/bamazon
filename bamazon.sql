use bamazon;

CREATE table Products(
item_id INTEGER(30) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NOT NULL,
depart_name VARCHAR(30) NOT NULL,
price DECIMAL(20,2) NOT NULL,
stock_quantity INTEGER(30) NOT NULL,
PRIMARY KEY(item_id)
);