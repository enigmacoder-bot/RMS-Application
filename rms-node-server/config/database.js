const mysql = require("mysql2");

// Create a connection pool (recommended for performance)
const db = mysql.createPool({
  host: "localhost",      // Change this if using a remote MySQL server
  user: "root",           // Your MySQL username
  password: "",           // Your MySQL password (keep empty if no password)
  database: "rms",        // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,    // Maximum number of connections
  queueLimit: 0
});

// Check if the connection is successful
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to the MySQL database.");
    connection.release(); 
  }
});

module.exports = db;
