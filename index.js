const mysql = require('mysql2/promise');

//Connect to DB
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Yusr@202523',
  database: 'shopleft_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('--- Database Connected Successfully! ---');
        connection.release();
    } catch (error) {
        console.error('--- Database Connection Failed: ---', error.message);
        process.exit(1); // Exit if connection fails
    }
}

// --- READ FUNCTIONS ---

// Function to get all users
async function getAllUsers() {
    try {
        const [rows] = await pool.query('SELECT id, username, email, created_at FROM users');
        console.log('\n--- All Users ---');
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error fetching all users:', error.message);
        return [];
    }
}

// Function to get all products
async function getAllProducts() {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        console.log('\n--- All Products ---');
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error fetching all products:', error.message);
        return [];
    }
}

// --- CRUD FUNCTIONS ---

// Function to delete a product by name
async function deleteProductByName(productName) {
    try {
        const [result] = await pool.execute('DELETE FROM products WHERE product_name = ?', [productName]);
        if (result.affectedRows > 0) {
            console.log(`\n--- Product '${productName}' deleted successfully. Affected rows: ${result.affectedRows} ---`);
        } else {
            console.log(`\n--- Product '${productName}' not found. No deletion occurred. ---`);
        }
        return result;
    } catch (error) {
        console.error(`Error deleting product '${productName}':`, error.message);
        throw error; // Re-throw to indicate failure
    }
}

// Function to insert a new product
async function insertNewProduct(productCode, name, price, stock_quantity) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO products (product_code, product_name, product_price, product_quantity) VALUES (?, ?, ?, ?)',
            [productCode, name, price, stock_quantity]
        );
        console.log(`\n--- Product '${name}' (Code: ${productCode}) inserted successfully. ID: ${result.insertId} ---`);
        return result;
    } catch (error) {
        console.error(`Error inserting product '${name}':`, error.message);
        throw error;
    }
}

// Function to update an existing product's information
async function updateProductInfo(productName, newPrice, newStockQuantity) {
    try {
        const [result] = await pool.execute(
            // Change 'price' to 'product_price'
            'UPDATE products SET product_price = ?, product_quantity = ? WHERE product_name = ?',
            [newPrice, newStockQuantity, productName]
        );
        if (result.affectedRows > 0) {
            console.log(`\n--- Product '${productName}' updated successfully. Affected rows: ${result.affectedRows} ---`);
        } else {
            console.log(`\n--- Product '${productName}' not found or no changes made. ---`);
        }
        return result;
    } catch (error) {
        console.error(`Error updating product '${productName}':`, error.message);
        throw error;
    }
}


// --- Main execution block for demonstration ---


(async () => {
    // 1. Test database connection
    await testDbConnection();

    // 2. Show all products initially
    console.log('\n--- Products Before Deletion ---');
    await getAllProducts();

    // 3. Delete the 'baro' product
    await deleteProductByName('baro');

    // 4. Show products after deletion to confirm 'baro' is gone
    console.log('\n--- Products After Deleting "baro" ---');
    await getAllProducts();

    // 5. Insert your favorite food item (Example: "Pizza")
    await insertNewProduct('piz1','Pizza', 120.00, 50);

    // 6. Show products after insertion
    console.log('\n--- Products After Inserting "Pizza" ---');
    await getAllProducts();

    // 7. Update an existing product (e.g., 'Laptop' price and stock)
    await updateProductInfo('Laptop', 1150.00, 60);

    // 8. Show products after update
    console.log('\n--- Products After Updating "Laptop" ---');
    await getAllProducts();

    // 9. Show all users
    await getAllUsers();

    // End the connection pool when all operations are done
    // In a real application, you'd usually keep the pool open for the app's lifetime.
    // We close it here because this is a script that runs and finishes.
    await pool.end();
    console.log('\n--- Database connection pool closed. ---');
})();

// Export the functions if you plan to use them in other files
module.exports = {
    pool,
    getAllUsers,
    getAllProducts,
    deleteProductByName,
    insertNewProduct,
    updateProductInfo
};