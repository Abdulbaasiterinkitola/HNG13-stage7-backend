import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isRevoked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;
