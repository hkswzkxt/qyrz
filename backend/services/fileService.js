const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
require('dotenv').config();

// Create gridfs storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (!extname || !mimetype) {
      throw new Error('Only image, PDF, and Word files are allowed');
    }

    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`,
    };
  }
});

// Initialize upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB file size limit
  },
});

// Get gridfs bucket
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Function to get file by filename
const getFile = (filename) => {
  return new Promise((resolve, reject) => {
    gfs.find({ filename }).toArray((err, files) => {
      if (err) reject(err);
      if (!files || files.length === 0) reject(new Error('File not found'));
      resolve(files[0]);
    });
  });
};

// Function to delete file by filename
const deleteFile = (filename) => {
  return new Promise((resolve, reject) => {
    gfs.find({ filename }).toArray((err, files) => {
      if (err) reject(err);
      if (!files || files.length === 0) reject(new Error('File not found'));
      
      gfs.delete(files[0]._id, (err) => {
        if (err) reject(err);
        resolve('File deleted successfully');
      });
    });
  });
};

module.exports = {
  upload,
  getFile,
  deleteFile,
  gfs
};
