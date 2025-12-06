import ApiKey from '../models/ApiKey.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Helper to hash key
const hashKey = (key) => {
    return crypto.createHash('sha256').update(key).digest('hex');
};

// @desc    Generate a new API key
// @route   POST /keys/create
// @access  Private
export const createKey = async (req, res) => {
    const { name, expiresInDays } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Key name is required' });
    }

    const rawKey = `sk_live_${uuidv4()}`;
    const hashedKey = hashKey(rawKey);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 30));

    try {
        const apiKey = await ApiKey.create({
            key: hashedKey,
            userId: req.user._id,
            name,
            expiresAt,
        });

        // Return the RAW key only once
        res.status(201).json({
            _id: apiKey._id,
            name: apiKey.name,
            apiKey: rawKey,
            expiresAt: apiKey.expiresAt,
            message: 'Save this key now! You will not be able to see it again.',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    List active keys
// @route   GET /keys
// @access  Private
export const getKeys = async (req, res) => {
    try {
        const keys = await ApiKey.find({ userId: req.user._id });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
