require ("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
    uri: process.env.MYSQL_URI,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });


pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
    console.log("Connected to MySQL");
    connection.release();
  });

module.exports = pool;