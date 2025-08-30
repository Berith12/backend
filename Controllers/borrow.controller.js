import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import User from "../models/user.js";

export const borrowBook = async (req, res) => {
  try {
  const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "Please provide bookId" });
    }
  const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
  } else if (book.available <= 0) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing" });
    }
  await Borrow.create({ userId: req.user.id, bookId });
    book.available -= 1;
    await book.save();

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error borrowing book", error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
  const { userId, bookId } = req.body;
    if (!userId || !bookId) {
      return res
        .status(400)
        .json({ message: "Please provide userId and bookId" });
    }
  const borrowRecord = await Borrow.findOne({ userId, bookId, returnDate: null });
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found or already returned" });
    }
    borrowRecord.returnDate = new Date();
    await borrowRecord.save();
  const book = await Book.findById(borrowRecord.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }
    res
      .status(200)
      .json({ message: "Book returned successfully", borrow: borrowRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
};

export const getBorrowRecords = async (req, res) => {
  try {
    const borrowRecords = await Borrow.find();

    const result = [];
    for (const record of borrowRecords) {
  const book = await Book.findById(record.bookId);
  const user = await User.findById(record.userId);

      if (book && user) {
        result.push({
          book: {
            borrowerName: user.Name,
            BorrowerTitle: book.title,
            borrowedDate: record.borrowedDate,
            returnDate: record.returnDate ? "Returned" : "Not Returned",
          },
        });
      }
    }

    res.status(200).json({
      message: "Borrow records retrieved successfully",
      borrowRecords: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving borrow records",
      error: error.message,
    });
  }
};

export const getBorrowRecordsById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Please provide userId" });
    }
  const borrowRecords = await Borrow.find({ userId });

    if (borrowRecords.length === 0) {
      return res.status(404).json({ message: "No borrow records found" });
    }

    const result = [];
    for (const record of borrowRecords) {
  const book = await Book.findById(record.bookId);
      if (book) {
        result.push({
          book: {
            title: book.title,
            borrowedDate: record.borrowedDate,
            returnDate: record.returnDate ? "Returned" : "Not Returned",
          },
        });
      }
    }

    res.status(200).json({
      message: "Borrow records retrieved successfully",
      borrowRecords: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving borrow records",
      error: error.message,
    });
  }
};
export const getAllBorrowRecords = async (req, res) => {
  try {
    const borrowRecords = await Borrow.find();

    const result = [];
    for (const record of borrowRecords) {
      const book = await Book.findById(record.bookId);
      const user = await User.findById(record.userId);

      if (book && user) {
        result.push({
          book: {
            borrowerName: user.Name,
            BorrowerTitle: book.title,
            borrowedDate: record.borrowedDate,
            returnDate: record.returnDate ? "Returned" : "Not Returned",
          },
        });
      }
    }

    res.status(200).json({
      message: "All borrow records retrieved successfully",
      borrowRecords: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving borrow records",
      error: error.message,
    });
  }
};