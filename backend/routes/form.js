const express = require('express');
const router = express.Router();
const { 
  submitForm, 
  getFormList, 
  getFormDetail, 
  approveForm,
  getFormStats 
} = require('../controllers/formController');
const { upload } = require('../services/fileService');

// Submit form
router.post('/submit', upload.fields([
  { name: 'license', maxCount: 1 },
  { name: 'idcard', maxCount: 1 },
  { name: 'demand', maxCount: 1 },
  { name: 'other', maxCount: 5 }
]), submitForm);

// Get form list with pagination and filtering
router.get('/list', getFormList);

// Get form detail by ID
router.get('/detail/:id', getFormDetail);

// Approve form (single or batch)
router.post('/approve', approveForm);

// Get form statistics
router.get('/stats', getFormStats);

// Get uploaded file
router.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const { gfs } = require('../services/fileService');
  
  gfs.find({ filename }).toArray((err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: '获取文件失败', error: err.message });
    }
    
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: '文件不存在' });
    }
    
    // Set content type based on file type
    res.set('Content-Type', files[0].contentType);
    
    // Stream the file to the client
    const readStream = gfs.openDownloadStream(files[0]._id);
    readStream.pipe(res);
  });
});

module.exports = router;
