import Book from "../models/book.js";

export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      quantity,
      available,
      cover,
      genres,
      type,
      status,
      rating,
      summary,
      recommended,
    } = req.body;

    if (!title || !author || !isbn || quantity == null || available == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Book.findOne({ isbn });
    if (exists) {
      return res.status(409).json({ message: "A book with this ISBN already exists" });
    }

    const newBook = await Book.create({
      title,
      author,
      isbn,
      quantity,
      available,
      cover,
      genres,
      type,
      status,
      rating,
      summary,
      recommended,
    });

    res.status(201).json({ message: "Book created", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};

export const getAllBooks = async (_req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Books retrieved", books });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Book.findById(id);
    if (!item) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book retrieved", book: item });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await Book.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book updated", book: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted", book: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};

export const deleteAllBooks = async (_req, res) => {
  try {
    const result = await Book.deleteMany({});
    res.status(200).json({ message: "All books removed", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: "Error removing all books", error: error.message });
  }
};
