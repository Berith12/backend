import express from 'express';
import { borrowBook, returnBook, getBorrowRecords, getBorrowRecordsById, getAllBorrowRecords } from '../Controllers/borrow.controller.js';
import { verifyBorrower, verifyLibrarian } from '../Controllers/auth.controller.js';

const router = express.Router();

// final paths when mounted at /api/borrow
router.post('/', verifyBorrower, borrowBook); // POST /api/borrow
router.post('/return', verifyBorrower, returnBook); // POST /api/borrow/return
router.get('/records', verifyLibrarian, getBorrowRecords);
router.get('/records/:userId', verifyBorrower, getBorrowRecordsById);
router.get('/records/all', verifyLibrarian, getAllBorrowRecords);

export default router;