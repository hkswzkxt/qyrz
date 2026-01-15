const EmailConfig = require('../models/EmailConfig');

// Get email configuration
const getEmailConfig = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      data: emailConfig
    });
  } catch (error) {
    console.error('Error getting email config:', error.message);
    res.status(500).json({
      success: false,
      message: '获取邮件配置失败',
      error: error.message
    });
  }
};

// Update email configuration
const updateEmailConfig = async (req, res) => {
  try {
    const { templates } = req.body;

    if (!templates) {
      return res.status(400).json({
        success: false,
        message: '请提供邮件模板配置'
      });
    }

    let emailConfig = await EmailConfig.findOne();
    if (!emailConfig) {
      // Create new email config if not exists
      emailConfig = await EmailConfig.create({
        templates
      });
    } else {
      // Update existing email config
      emailConfig = await EmailConfig.findOneAndUpdate(
        {},
        { templates },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: '邮件配置更新成功',
      data: emailConfig
    });
  } catch (error) {
    console.error('Error updating email config:', error.message);
    res.status(500).json({
      success: false,
      message: '更新邮件配置失败',
      error: error.message
    });
  }
};

module.exports = {
  getEmailConfig,
  updateEmailConfig
};
