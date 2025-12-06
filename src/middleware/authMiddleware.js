import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiKey from '../models/ApiKey.js';
import crypto from 'crypto';

// Helper to hash key
const hashKey = (key) => {
    return crypto.createHash('sha256').update(key).digest('hex');
};

export const protect = async (req, res, next) => {
    let token;
    const apiKeyHeader = req.headers['x-api-key'];

    // 1. Check for Bearer Token (User Auth)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // 2. Check for API Key (Service Auth)
    if (apiKeyHeader) {
        try {
            const hashedKey = hashKey(apiKeyHeader);
            const apiKey = await ApiKey.findOne({ key: hashedKey });

            if (!apiKey) {
                return res.status(401).json({ message: 'Invalid API Key' });
            }

            if (apiKey.isRevoked) {
                return res.status(401).json({ message: 'API Key has been revoked' });
            }

            if (new Date() > apiKey.expiresAt) {
                return res.status(401).json({ message: 'API Key has expired' });
            }

            // Attach user associated with the key
            req.user = await User.findById(apiKey.userId).select('-password');
            req.authType = 'apikey';
            return next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (!token && !apiKeyHeader) {
        res.status(401).json({ message: 'Not authorized, no token or key' });
    }
};
