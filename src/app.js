import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes Placeholder
app.get('/', (req, res) => {
    res.json({ message: 'This is my HNG13 backend stage 7 task - Mini Authentication + API Key System' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
