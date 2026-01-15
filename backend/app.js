const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to MongoDB Atlas (异步连接，不阻塞服务器启动)
connectDB().catch(err => {
  console.warn('MongoDB连接失败，服务将继续运行，但数据功能将不可用:', err.message);
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const formRoutes = require('./routes/form');
const configRoutes = require('./routes/config');

app.use('/api/form', formRoutes);
app.use('/api/config', configRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend API is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
