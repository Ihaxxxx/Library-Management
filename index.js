const fs = require('fs');
const mysql = require('mysql2/promise');


function toSQLValue(val) {
    return val === undefined ? null : val;
}


async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'MyNewPassword123!',
        database: 'library_management'
    });

    const data = JSON.parse(fs.readFileSync('cleaned_books.json', 'utf-8'));

    const uniqueBooks = [];
    const isbnSet = new Set();

    for (const book of data) {
        // Skip if ISBN missing or empty
        if (!book.isbn || isbnSet.has(book.isbn)) continue;
        isbnSet.add(book.isbn);
        uniqueBooks.push(book);
    }

    const authorMap = new Map(); // Cache author name => id

    for (const book of uniqueBooks) {
        // Use INSERT IGNORE to skip duplicate ISBNs gracefully
        const [bookResult] = await connection.execute(
            `INSERT IGNORE INTO books (title, average_rating, isbn, published_year, category, imageurl)
   VALUES (?, ?, ?, ?, ?, ?)`,
            [
                toSQLValue(book.original_title),
                toSQLValue(book.average_rating),
                toSQLValue(book.isbn),
                toSQLValue(book.original_publication_year),
                toSQLValue(book.category),
                toSQLValue(book.image_url)
            ]
        );


        // If insert was ignored (duplicate), get existing book id
        let bookId = bookResult.insertId;
        if (bookId === 0) {
            // Fetch existing book id by ISBN
            const [rows] = await connection.execute(
                `SELECT id FROM books WHERE isbn = ?`,
                [book.isbn]
            );
            if (rows.length > 0) {
                bookId = rows[0].id;
            } else {
                console.warn(`Book with ISBN ${book.isbn} not found after insert ignore.`);
                continue; // Skip to next book
            }
        }

        // Split authors by comma and trim whitespace
        const authors = book.authors.split(',').map(a => a.trim());

        for (const author of authors) {
            if (!author) continue; // skip empty authors

            let authorId;
            if (authorMap.has(author)) {
                authorId = authorMap.get(author);
            } else {
                // Check if author exists
                const [authorRows] = await connection.execute(
                    `SELECT id FROM authors WHERE name = ?`,
                    [author]
                );

                if (authorRows.length > 0) {
                    authorId = authorRows[0].id;
                } else {
                    // Insert new author
                    const [insertAuthor] = await connection.execute(
                        `INSERT INTO authors (name) VALUES (?)`,
                        [author]
                    );
                    authorId = insertAuthor.insertId;
                }

                authorMap.set(author, authorId);
            }

            // Link book and author, ignore duplicate key errors gracefully
            try {
                await connection.execute(
                    `INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)`,
                    [bookId, authorId]
                );
            } catch (e) {
                if (e.code === 'ER_DUP_ENTRY') {
                    // duplicate link, ignore
                } else {
                    throw e;
                }
            }
        }
    }

    console.log('Import complete!');
    await connection.end();
}

main().catch(console.error);
