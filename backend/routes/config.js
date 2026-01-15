const express = require('express');
const router = express.Router();
const { 
  getEmailConfig, 
  updateEmailConfig 
} = require('../controllers/configController');

// Get email configuration
router.get('/email', getEmailConfig);

// Update email configuration
router.post('/email', updateEmailConfig);

module.exports = router;
