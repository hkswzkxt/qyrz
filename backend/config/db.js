const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // 不退出进程，让服务器继续运行
    throw error;
  }
};

module.exports = connectDB;
