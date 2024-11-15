const mysql = require("mysql2");
const fs = require("fs");

const dbUrl = process.env.MYSQL_URI;
const caPath = process.env.CA_PATH;

const createPool = (url, caPath) => {
  const connectionConfig = {
    ...mysql.createConnection(url).config,
    ssl: {
      ca: fs.readFileSync(caPath),
    },
    timezone: "Z"

  };

  delete connectionConfig.maxPacketSize;
  delete connectionConfig.clientFlags;

  const pool = mysql.createPool(connectionConfig);

  // Handle connection errors and   reconnect if necessary
  pool.on("connection", (connection) => {
    console.log("Connected to MySQL");

    connection.on("error", (err) => {
      console.error("MySQL connection error:", err);

      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.log("Attempting to reconnect...");

        // Attempt to reconnect to the database
        pool.getConnection((reconnectErr, newConnection) => {
          if (reconnectErr) {
            console.error("Reconnection failed:", reconnectErr);
          } else {
            console.log("Reconnected to MySQL");

            // Release the existing connection back to the pool
            pool.releaseConnection(connection);

            // Update the existing connection with the new connection configuration
            connection.config = newConnection.config;

            // Release the new connection back to the pool
            newConnection.release();
          }
        });
      } else {
        throw err;
      }
    });
  });

  // Add a keep-alive mechanism
  setInterval(() => {
    pool.query("SELECT SUM(claps.applause_count) AS total_claps FROM claps", (err, results) => {
      if (err) {
        console.error("MySQL query error:", err);
      } else {
        console.log("Query results:", results);
      }
    });
  }, 360000); // check every 6 minutes

  return pool;
};

const pool = createPool(dbUrl, caPath);

// Example query


// Close the pool when the application is finished
process.on("exit", () => {
  pool.end();
});

module.exports = pool;