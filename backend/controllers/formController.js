const FormData = require('../models/FormData');
const EmailConfig = require('../models/EmailConfig');
const { sendEmailNotification } = require('../services/emailService');

// Submit form data
const submitForm = async (req, res) => {
  try {
    // Extract form data from request body
    const formData = {
      ...req.body,
      ipAddress: req.ip,
      files: []
    };

    // Process uploaded files if any
    if (req.files) {
      // Iterate through all uploaded files and add them to files array
      Object.entries(req.files).forEach(([fieldName, files]) => {
        files.forEach(file => {
          formData.files.push({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            url: `/api/form/files/${file.filename}` // URL to access the file
          });
        });
      });
    }

    // Create new form data document
    const newForm = await FormData.create(formData);

    res.status(201).json({
      success: true,
      message: '表单提交成功',
      data: newForm
    });
  } catch (error) {
    console.error('Error submitting form:', error.message);
    res.status(500).json({
      success: false,
      message: '表单提交失败',
      error: error.message
    });
  }
};

// Get form list with pagination, filtering, and sorting
const getFormList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      companyName,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (companyName) {
      filter.companyName = {
        $regex: companyName,
        $options: 'i'
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await FormData.countDocuments(filter);

    // Get form list
    const forms = await FormData.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        forms,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error getting form list:', error.message);
    res.status(500).json({
      success: false,
      message: '获取表单列表失败',
      error: error.message
    });
  }
};

// Get form detail by ID
const getFormDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await FormData.findById(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: '表单不存在'
      });
    }

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error getting form detail:', error.message);
    res.status(500).json({
      success: false,
      message: '获取表单详情失败',
      error: error.message
    });
  }
};

// Approve form (single or batch)
const approveForm = async (req, res) => {
  try {
    const {
      ids,
      status,
      approvedBy = 'admin',
      approvalNote = ''
    } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要审核的表单ID列表'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '审核状态必须是approved或rejected'
      });
    }

    // Get email config
    let emailConfig = await EmailConfig.findOne();
    if (!emailConfig) {
      // Create default email config if not exists
      emailConfig = await EmailConfig.create({
        templates: {
          approved: {
            subject: '【企业入驻】您的申请已通过审核',
            content: '<p>尊敬的{{contactName}}先生/女士：</p><p>您好！</p><p>恭喜您的企业入驻申请已通过审核。</p><p>企业名称：{{companyName}}</p><p>审核时间：{{approvedAt}}</p><p>感谢您的合作！</p>'
          },
          rejected: {
            subject: '【企业入驻】您的申请未通过审核',
            content: '<p>尊敬的{{contactName}}先生/女士：</p><p>您好！</p><p>很遗憾，您的企业入驻申请未通过审核。</p><p>企业名称：{{companyName}}</p><p>审核时间：{{approvedAt}}</p><p>备注：{{approvalNote}}</p><p>如有疑问，请随时联系我们。</p>'
          }
        }
      });
    }

    // Update form status
    const updatedForms = await FormData.updateMany(
      { _id: { $in: ids } },
      {
        status,
        approvedBy,
        approvedAt: new Date(),
        approvalNote
      },
      { new: true }
    );

    // Get updated forms for email sending
    const forms = await FormData.find({ _id: { $in: ids } });

    // Send email notifications in parallel
    const emailPromises = forms.map(form => 
      sendEmailNotification(form, emailConfig)
    );
    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      message: `成功审核${ids.length}个表单`,
      data: {
        updatedCount: updatedForms.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error approving form:', error.message);
    res.status(500).json({
      success: false,
      message: '审核表单失败',
      error: error.message
    });
  }
};

// Get form statistics
const getFormStats = async (req, res) => {
  try {
    // Get total forms count
    const total = await FormData.countDocuments();
    
    // Get count by status
    const pending = await FormData.countDocuments({ status: 'pending' });
    const approved = await FormData.countDocuments({ status: 'approved' });
    const rejected = await FormData.countDocuments({ status: 'rejected' });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: {
          pending,
          approved,
          rejected
        }
      }
    });
  } catch (error) {
    console.error('Error getting form stats:', error.message);
    res.status(500).json({
      success: false,
      message: '获取表单统计数据失败',
      error: error.message
    });
  }
};

module.exports = {
  submitForm,
  getFormList,
  getFormDetail,
  approveForm,
  getFormStats
};
