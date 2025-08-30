import express from 'express';
import { addBook, getAllBooks, getBookById, updateBook, deleteBook, deleteAllBooks, searchBooks } from '../Controllers/book.controller.js';
import { verifyLibrarian } from '../Controllers/auth.controller.js';

const router = express.Router();

router.post('/', verifyLibrarian, addBook);
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);
router.put('/:id', verifyLibrarian, updateBook);
router.delete('/:id', verifyLibrarian, deleteBook);
router.delete('/', verifyLibrarian, deleteAllBooks);

export default router;