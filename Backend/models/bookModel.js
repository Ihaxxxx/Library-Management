const db = require("../config/db");

async function getBookCount() {
  const [bookCount] = await db.query("SELECT COUNT(*) AS total FROM books");
  return bookCount[0];
}

async function getBookCategories() {
  const [categories] = await db.query(
    "SELECT category FROM books group by category"
  );
  return categories;
}

async function getSpecificBooks(offset, limit, category, ratingOrder = "desc") {
  const order = ratingOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
  if (category !== "") {
    const [rows] = await db.query(
      `
  SELECT 
    books.id, 
    books.title, 
    books.average_rating, 
    books.published_year, 
    books.category, 
    books.imageurl, 
    authors.name AS author, 
    CASE WHEN ib.book_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_issued,
    (SELECT COUNT(*) FROM books WHERE category = ? AND title != '') AS categoryCount
  FROM books 
  INNER JOIN book_authors ON books.id = book_authors.book_id 
  INNER JOIN authors ON book_authors.author_id = authors.id 
  LEFT JOIN issued_books ib ON books.id = ib.book_id AND ib.returned_date IS NULL
  WHERE books.title != '' AND books.category = ?
  ORDER BY books.average_rating ${order}
  LIMIT ? OFFSET ?;
  `,
      [category, category, limit, offset]
    );

    return rows;
  } else {
    const [rows] = await db.query(
      `
  SELECT 
    books.id, 
    books.title, 
    books.average_rating, 
    books.published_year, 
    books.category, 
    books.imageurl, 
    authors.name AS author,
    CASE WHEN ib.book_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_issued,
    (SELECT COUNT(*) FROM books WHERE title != '') AS categoryCount
  FROM books 
  INNER JOIN book_authors ON books.id = book_authors.book_id 
  INNER JOIN authors ON book_authors.author_id = authors.id 
  LEFT JOIN issued_books ib ON books.id = ib.book_id AND ib.returned_date IS NULL
  WHERE books.title != ''
  ORDER BY books.average_rating ${order}
  LIMIT ? OFFSET ?;
`,
      [limit, offset]
    );
    return rows
  }
}

async function getSingleBook(book_id) {
  try {
    const [book] = await db.query(
      `SELECT 
         b.title, b.imageurl,
         CASE WHEN ib.book_id IS NOT NULL THEN 1 ELSE 0 END AS is_issued
       FROM books b
       LEFT JOIN issued_books ib ON b.id = ib.book_id AND ib.returned_date IS NULL
       WHERE b.id = ?`,
      [book_id]
    );

    if (!book || book.length === 0) {
      return null;
    }
    return book[0];
  } catch (err) {
    console.error("Database error in getSingleBook:", err);
    throw new Error("Database query failed");
  }
}

async function issueBook(bookid, userid) {
  const [result] = await db.query(
    `INSERT INTO issued_books (book_id, user_id, issued_date, due_date)
   VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 21 DAY))`,
    [bookid, userid]
  );
  return result;
}

// for returning a book
async function returnBook(user_id, book_id) {
  const [result] = await db.query(
    `UPDATE issued_books 
     SET returned_date = CURRENT_TIMESTAMP 
     WHERE user_id = ? AND book_id = ? AND returned_date IS NULL`,
    [user_id, book_id]
  );
  return result.affectedRows > 0;
}

async function reIssueBook(user_id, book_id) {
  const [rows] = await db.query(
    `SELECT issued_date, due_date 
     FROM issued_books 
     WHERE user_id = ? AND book_id = ? AND returned_date IS NULL`,
    [user_id, book_id]
  );

  if (rows.length === 0) {
    throw new Error("No active issued book found for reissue.");
  }

  const { issued_date, due_date } = rows[0];

  const issued = new Date(issued_date);
  const due = new Date(due_date);

  const durationInDays = Math.floor((due - issued) / (1000 * 60 * 60 * 24));

  if (durationInDays >= 60) {
    throw new Error(
      "Book already issued for 2 months. Cannot reissue further."
    );
  }

  // Step 2: Extend due_date by 14 days
  const [result] = await db.query(
    `UPDATE issued_books 
     SET due_date = DATE_ADD(due_date, INTERVAL 14 DAY)
     WHERE user_id = ? AND book_id = ? AND returned_date IS NULL`,
    [user_id, book_id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  getBookCount,
  getBookCategories,
  getSpecificBooks,
  getSingleBook,
  issueBook,
  returnBook,
  reIssueBook,
};
