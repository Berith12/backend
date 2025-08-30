import express from 'express';
import { getMe, updateMe } from '../Controllers/user.controller.js';
import { verifyToken } from '../Middleware/verfiy.token.js';
import { promoteToLibrarian, verifyLibrarian } from '../Controllers/auth.controller.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);
router.post('/promote', verifyToken, verifyLibrarian, promoteToLibrarian);

export default router;