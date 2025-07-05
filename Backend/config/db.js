const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'MyNewPassword123!',
  database: 'library_management',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
