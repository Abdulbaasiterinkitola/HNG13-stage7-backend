import express from 'express';
import { createKey, getKeys } from '../controllers/keyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createKey);
router.get('/', protect, getKeys);

export default router;
