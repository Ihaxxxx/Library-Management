const db = require("../config/db");
const bcrypt = require("bcrypt");

async function getUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

async function getSpecificUser(userid) {
  const query = `
  SELECT 
    u.id AS user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.email,
    u.created_at,

    ib.id AS issued_book_id,
    ib.issued_date,
    ib.due_date,
    ib.returned_date,

    CASE 
        WHEN ib.returned_date IS NULL AND ib.id IS NOT NULL THEN 'Not Returned'
        WHEN ib.returned_date IS NOT NULL THEN 'Returned'
        ELSE NULL
    END AS return_status,

    CASE 
        WHEN ib.due_date >= CURDATE() THEN 'Not Due'
        WHEN ib.due_date < CURDATE() THEN 'Overdue'
        ELSE NULL
    END AS due_status,

    b.id AS book_id,
    b.title,
    b.isbn,
    b.category,
    b.published_year,
    b.imageurl,

    GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors,

    MAX(f.amount) AS fine_amount,
    MAX(f.status) AS fine_status

FROM users u
LEFT JOIN issued_books ib ON u.id = ib.user_id
LEFT JOIN books b ON ib.book_id = b.id
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id
LEFT JOIN fines f ON f.issued_book_id = ib.id

WHERE u.id = ? AND u.role = 'member'

GROUP BY 
    u.id, u.first_name, u.last_name, u.email,
    ib.id, ib.issued_date, ib.due_date, ib.returned_date,
    b.id, b.title, b.isbn, b.category, b.published_year, b.imageurl

ORDER BY ib.issued_date DESC;
  
  `;
  try {
    const [rows] = await db.query(query, [userid]);
    return rows;
  } catch (err) {
    console.error("Error fetching issued books:", err);
    throw err;
  }
}

async function createUser(firstname, lastname, email, password) {
  const [existing] = await db.query("SELECT * FROM users WHERE email = ? ", [
    email,
  ]);
  if (existing.length > 0) {
    throw new Error("User already exists");
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const [result] = await db.query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
        [firstname, lastname, email, hash]
      );
      const [newUser] = await db.query("SELECT * FROM users WHERE id = ?", [
        result.insertId,
      ]);
      return newUser[0];
    });
  });
}

async function loginUser(email, password) {
  const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length === 0) {
    throw new Error("invalid credentials");
  }
  const match = bcrypt.compareSync(password, existing[0].password);
  if (!match) {
    throw new Error("invalid credentials");
  }
  return existing[0];
}

async function createCustomer(firstname, lastname, email, password) {
  const [existing] = await db.query("SELECT * FROM users WHERE email = ? and role = 'member'", [
    email,
  ]);
  if (existing.length > 0) {
    throw new Error("User already exists");
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const [result] = await db.query(
        "INSERT INTO users (first_name, last_name, email, password,role) VALUES (?, ?, ?, ?,?)",
        [firstname, lastname, email, hash, "member"]
      );
      const [newUser] = await db.query("SELECT * FROM users WHERE id = ?", [
        result.insertId,
      ]);
      return newUser[0];
    });
  });
}

async function getUserDetails(userid) {
  const [user] = await db.query(
    `SELECT
     CONCAT(first_name, " ", last_name) AS full_name, 
     email,
     (
       SELECT COUNT(*) 
       FROM issued_books
       WHERE user_id = users.id AND returned_date IS NULL
     ) AS books_issued_count
   FROM users
   WHERE id = ? AND role = "member"`,
    [userid]
  );

  if (!user || user.length === 0) {
    return null;
  }
  return user[0];
}

async function issuedBooks(userid) {
  try {
    const [rows] = await db.query(
      `SELECT 
  ib.book_id,
  b.title,
  b.imageurl,
  ib.issued_date,
  ib.due_date,
  CONCAT(u.first_name, ' ', u.last_name) AS full_name,
  u.email
FROM issued_books ib
JOIN books b ON ib.book_id = b.id
JOIN users u ON ib.user_id = u.id
WHERE ib.user_id = ? AND ib.returned_date IS NULL`,
      [userid]
    );
    return rows;
  } catch (err) {
    console.error("Database error in issuedBooks:", err);
    throw new Error("Database query failed");
  }
}
async function userExists(userid) {
  const [result] = await db.query(`SELECT id FROM users WHERE id = ?`, [
    userid,
  ]);
  return result.length > 0;
}

module.exports = {
  getUsers, // get users
  createUser, // to create a admin
  loginUser, // to login an admin
  createCustomer, // to create a customer
  getUserDetails, // to get in issue book
  issuedBooks, // to get data in return books
  userExists, // to check in return books
  getSpecificUser, // get specific user
};
