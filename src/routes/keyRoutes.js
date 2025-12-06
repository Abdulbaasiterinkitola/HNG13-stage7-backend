import express from 'express';
import { createKey, getKeys, revokeKey } from '../controllers/keyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createKey);
router.get('/', protect, getKeys);
router.post('/revoke', protect, revokeKey);

export default router;
