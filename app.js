// app.js
require('dotenv').config(); // Load environment variables from .env

const mysql = require('mysql2/promise'); // Import with '/promise' for async/await

// Database configuration from environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE // This is the database name, not the table name
};

let connection; // Declare connection variable globally or pass it around

// 3. Function to link the database
async function connectToDatabase() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the pick_n_steal database.');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1); // Exit the process if unable to connect
    }
}

// 4a. Function to return all employee data
async function getAllEmployees() {
    try {
        // Querying the 'pick_n_steal' table as per your database schema
        const [rows] = await connection.execute('SELECT * FROM pick_n_steal');
        console.log('\n--- All Employees ---');
        console.table(rows);
        return rows;
    } catch (error) {
        console.error('Error fetching all employees:', error.message);
        return [];
    }
}

// 4b. Function to return a single employee based on their employee_id
async function getEmployeeById(employeeId) {
    try {
        // Querying the 'pick_n_steal' table
        const [rows] = await connection.execute('SELECT * FROM pick_n_steal WHERE employee_id = ?', [employeeId]);
        console.log(`\n--- Employee with ID ${employeeId} ---`);
        if (rows.length > 0) {
            console.table(rows);
            return rows[0];
        } else {
            console.log(`No employee found with ID ${employeeId}.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching employee with ID ${employeeId}:`, error.message);
        return null;
    }
}

// 4c. Function to add a new employee and then return all employees
async function addNewEmployee(employeeData) {
    try {
        // Destructure employeeData to match the table columns and order
        const { first_name, last_name, email, phone_number, department, salary } = employeeData;
        // Inserting into the 'pick_n_steal' table
        const [result] = await connection.execute(
            'INSERT INTO pick_n_steal (first_name, last_name, email, phone_number, department, salary) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, department, salary]
        );
        console.log(`\nEmployee '${first_name} ${last_name}' added successfully with ID: ${result.insertId}`);
        console.log('--- All Employees (after adding new) ---');
        return await getAllEmployees();
    } catch (error) {
        console.error('Error adding new employee:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('An employee with this email already exists.');
        }
        return null;
    }
}

// 4d. Function to remove an employee from the table based on their employee id and then returns all employees
async function removeEmployee(employeeId) {
    try {
        // Deleting from the 'pick_n_steal' table
        const [result] = await connection.execute('DELETE FROM pick_n_steal WHERE employee_id = ?', [employeeId]);
        if (result.affectedRows > 0) {
            console.log(`\nEmployee with ID ${employeeId} removed successfully.`);
            console.log('--- All Employees (after removal) ---'); // Added for consistent output
        } else {
            console.log(`\nNo employee found with ID ${employeeId} to remove.`);
        }
        return await getAllEmployees();
    } catch (error) {
        console.error(`Error removing employee with ID ${employeeId}:`, error.message);
        return null;
    }
}

// 4e. Function to update all the values of an employee based on their employee id and then returns the employees new data that was edited.
async function updateEmployee(employeeId, updatedData) {
    try {
        // Destructure updatedData to match the table columns and order
        const { first_name, last_name, email, phone_number, department, salary } = updatedData;
        // Updating the 'pick_n_steal' table
        const [result] = await connection.execute(
            'UPDATE pick_n_steal SET first_name = ?, last_name = ?, email = ?, phone_number = ?, department = ?, salary = ? WHERE employee_id = ?',
            [first_name, last_name, email, phone_number, department, salary, employeeId]
        );
        if (result.affectedRows > 0) {
            console.log(`\nEmployee with ID ${employeeId} updated successfully.`);
            console.log(`--- Updated Employee Data for ID ${employeeId} ---`);
            return await getEmployeeById(employeeId); // Return the updated employee's data
        } else {
            console.log(`\nNo employee found with ID ${employeeId} to update or no changes were made.`);
            return null;
        }
    } catch (error) {
        console.error(`Error updating employee with ID ${employeeId}:`, error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('An employee with this email already exists.');
        }
        return null;
    }
}

// Main execution function
async function main() {
    await connectToDatabase();

    // Perform the operations as requested
    await getAllEmployees();

    // Example: Get a single employee
    // Assuming employee_id 1 exists from initial data
    await getEmployeeById(1);

    // Generate a unique timestamp for emails to avoid duplicates on repeated runs
    const timestamp = Date.now();

    // Example: Add a new employee with a unique email
    const newEmployee = {
        first_name: 'Alice',
        last_name: 'Johnson',
        email: `alice.johnson_${timestamp}@example.com`, // Using timestamp for uniqueness
        phone_number: '111-222-3333',
        department: 'Marketing',
        salary: 48000.00
    };
    const addedEmployees = await addNewEmployee(newEmployee);
    let aliceId = null;
    if (addedEmployees && addedEmployees.length > 0) {
        // Find the newly added Alice by her unique email from the returned list
        const foundAlice = addedEmployees.find(emp => emp.email === newEmployee.email);
        if (foundAlice) {
            aliceId = foundAlice.employee_id;
            console.log(`Found newly added Alice with ID: ${aliceId}`);
        }
    }


    // Example: Update an employee (let's update the newly added Alice)
    const updatedEmployeeData = {
        first_name: 'Alicia',
        last_name: 'Johnston',
        email: `alicia.johnston_updated_${timestamp}@example.com`, // Using timestamp for uniqueness here too
        phone_number: '999-888-7777',
        department: 'Senior Marketing',
        salary: 55000.00
    };

    if (aliceId) {
         await updateEmployee(aliceId, updatedEmployeeData);
    } else {
        console.log("Could not find the newly added Alice Johnson to update. Skipping update.");
    }

    // Example: Remove an employee (let's remove Peter Jones, assuming ID 3 from initial data)
    await removeEmployee(3);

    // Close the connection when all operations are done
    if (connection) {
        await connection.end();
        console.log('\nDatabase connection closed.');
    }
}

// Execute the main function
main();
