CREATE DATABASE shopleft_database;
USE shopleft_database;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(45) NOT NULL UNIQUE,
    last_name VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create products table
CREATE TABLE products (
    product_code INT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    product_quantity INT NOT NULL
);

ALTER TABLE products MODIFY COLUMN product_code VARCHAR(50) NOT NULL;


-- Insert data into the users table
INSERT INTO users (id,email, first_name, last_name, password)
VALUES (1, 'mattew@lifechoices.co.za','Matthew', 'Brown', 'matthewbrown');

-- Insert data into the products table
INSERT INTO products (product_code, product_name, product_price, product_quantity) 
VALUES	('baro1', 'Bar One', 9.99, 20),
        ('hand1', 'Handy Andy', 19.00, 5),
		('pato1', 'Potatoes', 39.99, 10);
        
ALTER TABLE products
MODIFY COLUMN product_code VARCHAR(50) NOT NULL;

-- Add 3 more products
INSERT INTO products (product_code, product_name, product_price, product_quantity) 
VALUES	 ('Hp1', 'HeadPhone', 99.99, 120),
         ('Sp1', 'SmartPhonre', 899.00, 80),
         ('Tab1', 'Tablet', 450.00, 90);

-- Addind myself as a user
INSERT INTO users (id,email, first_name, last_name, password)
 VALUES   (2, 'yusr@abrahms.co.za','Yusra', 'Abrahams', '@yusr@');

