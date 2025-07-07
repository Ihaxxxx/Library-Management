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

    const data = JSON.parse(fs.readFileSync('books.json', 'utf-8'));

    const uniqueBooks = [];
    const isbnSet = new Set();

    for (const book of data) {
        if (!book.isbn) continue;

        // Convert ISBN to string to match VARCHAR in DB
        book.isbn = book.isbn.toString();

        if (isbnSet.has(book.isbn)) continue;
        isbnSet.add(book.isbn);
        uniqueBooks.push(book);
    }

    const authorMap = new Map();

    for (const book of uniqueBooks) {
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

        let bookId = bookResult.insertId;
        if (bookId === 0) {
            // Book exists, fetch id
            const [rows] = await connection.execute(
                `SELECT id FROM books WHERE isbn = ?`,
                [book.isbn]
            );
            if (rows.length > 0) {
                bookId = rows[0].id;
            } else {
                console.warn(`Book with ISBN ${book.isbn} not found after insert ignore.`);
                continue;
            }
        }

        // Process authors (split by commas)
        const authors = book.authors.split(',').map(a => a.trim());

        for (const author of authors) {
            if (!author) continue;

            let authorId;
            if (authorMap.has(author)) {
                authorId = authorMap.get(author);
            } else {
                const [authorRows] = await connection.execute(
                    `SELECT id FROM authors WHERE name = ?`,
                    [author]
                );

                if (authorRows.length > 0) {
                    authorId = authorRows[0].id;
                } else {
                    const [insertAuthor] = await connection.execute(
                        `INSERT INTO authors (name) VALUES (?)`,
                        [author]
                    );
                    authorId = insertAuthor.insertId;
                }
                authorMap.set(author, authorId);
            }

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
