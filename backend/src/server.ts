import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// Allow requests from React Native dev client (Metro bundler runs on port 8081)
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check — no auth required
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Todo API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler for unrecognised routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
