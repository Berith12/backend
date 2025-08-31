// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import borrowRoutes from './routes/borrow.route.js';
import userRoutes from './routes/user.route.js';
import contactRoutes from './routes/contact.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'https://your-frontend.vercel.app' // 👈 add your deployed frontend here
        ];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// start
const start = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
};

start();