const mysql = require('mysql2/promise');

// Create a connection pool to the database
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // from .env
    user: process.env.DB_USER || 'root',      // from .env
    password: process.env.DB_PASS || 'Mysqlsnu@123', // from .env
    database: process.env.DB_NAME || 'university_management_system', // from .env
    waitForConnections: true,
    connectionLimit: 10,  // Limit the number of connections in the pool
    queueLimit: 0         // No limit on queued connection requests
});

// Test the connection to the database
(async () => {
    try {
        // Attempt to get a connection from the pool
        const connection = await db.getConnection();
        console.log('Database connection established successfully.');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1); // Exit the application on database connection error
    }
})();

// Export the pool for use in other files
module.exports = db;


// const mysql = require('mysql2/promise');

// // Create a connection pool to the database
// const db = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost', // from .env
//     user: process.env.DB_USER || 'root',      // from .env
//     password: process.env.DB_PASS || 'Mysqlsnu@123', // from .env
//     database: process.env.DB_NAME || 'university_management_system', // from .env
//     waitForConnections: true,
//     connectionLimit: 10,  // Limit the number of connections in the pool
//     queueLimit: 0         // No limit on queued connection requests
// });

// // Export the pool for use in other files
// module.exports = db;
