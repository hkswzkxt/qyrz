const mongoose = require('mongoose');

const EmailConfigSchema = new mongoose.Schema({
  templates: {
    approved: {
      subject: {
        type: String,
        default: '【企业入驻】您的申请已通过审核'
      },
      content: {
        type: String,
        default: '<p>尊敬的{{contactName}}先生/女士：</p><p>您好！</p><p>恭喜您的企业入驻申请已通过审核。</p><p>企业名称：{{companyName}}</p><p>审核时间：{{approvedAt}}</p><p>感谢您的合作！</p>'
      }
    },
    rejected: {
      subject: {
        type: String,
        default: '【企业入驻】您的申请未通过审核'
      },
      content: {
        type: String,
        default: '<p>尊敬的{{contactName}}先生/女士：</p><p>您好！</p><p>很遗憾，您的企业入驻申请未通过审核。</p><p>企业名称：{{companyName}}</p><p>审核时间：{{approvedAt}}</p><p>备注：{{approvalNote}}</p><p>如有疑问，请随时联系我们。</p>'
      }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 添加更新时间中间件
EmailConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const EmailConfig = mongoose.model('EmailConfig', EmailConfigSchema);

module.exports = EmailConfig;
