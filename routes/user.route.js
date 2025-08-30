import express from 'express';
import { getMe, updateMe } from '../Controllers/user.controller.js';
import { verifyToken } from '../Middleware/verfiy.token.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);

export default router;