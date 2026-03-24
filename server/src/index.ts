import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { setupSocketIO } from './config/socket';

const app = express();

const httpServer = createServer(app);

// CORS configuration
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://taskmanagement-kohl-two.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
});
setupSocketIO(io);

// Make io available to routes
app.set('io', io);



// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', message: 'Task Management API' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
