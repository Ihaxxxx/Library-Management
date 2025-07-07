const BookModel = require("../models/bookModel");

const getAllBooks = async (req, res) => {
  try {
    const bookCount = await BookModel.getBookCount();
    const categories = await BookModel.getBookCategories();
    res.json({ totalBooks: bookCount.total, categories });
  } catch (err) {
    console.error("Error in getBooks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpecificBooks = async (req, res) => {
  try {
    const { offset, limit, category, sortBy, orderDirection } = req.body;
    const books = await BookModel.getSpecificBooks(
      offset,
      limit,
      category,
      sortBy,
      orderDirection
    );

    res.json(books);
  } catch (err) {
    console.error("Error in getBooks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const book = await BookModel.getSingleBook(req.body.bookid);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    } else {
      res.status(200).json(book); // includes is_issued field now
    }
  } catch (err) {
    console.error("Error in getBooks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const issueBook = async (req, res) => {
  try {
    const books = await BookModel.issueBook(req.body.bookid, req.body.userid);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const reIssueBook = async (req, res) => {
  try {
    const { userid, bookid } = req.body;

    const success = await BookModel.reIssueBook(userid, bookid);

    if (success) {
      res.status(200).json({ message: "Book reissued successfully." });
    } else {
      res.status(404).json({ error: "Reissue failed." });
    }
  } catch (err) {
    if (err.message.includes("2 months")) {
      return res.status(400).json({ error: err.message });
    }
    console.error("Reissue error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const returnBook = async (req, res) => {
  const { userid, bookid } = req.body;
  try {
    const success = await BookModel.returnBook(userid, bookid);

    if (!success) {
      return res
        .status(404)
        .json({ error: "Book not found or already returned." });
    }

    res.status(200).json({ message: "Book returned successfully." });
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getAllBooks,
  getSpecificBooks,
  getSingleBook,
  issueBook,
  returnBook,
  reIssueBook,
};
