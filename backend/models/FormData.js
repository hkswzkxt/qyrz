const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  // 企业基础信息
  companyName: {
    type: String,
    required: [true, '企业全称是必填项'],
    trim: true
  },
  socialCreditCode: {
    type: String,
    required: [true, '统一社会信用代码是必填项'],
    trim: true
  },
  companyType: {
    type: String,
    enum: ['', '国企', '民企', '外资', '合资', '其他'],
    default: ''
  },
  industry: {
    type: String,
    trim: true
  },
  registrationAddress: {
    type: String,
    required: [true, '企业注册地址是必填项'],
    trim: true
  },
  
  // 对接人信息
  contactName: {
    type: String,
    required: [true, '对接人姓名是必填项'],
    trim: true
  },
  contactPhone: {
    type: String,
    required: [true, '联系电话是必填项'],
    trim: true
  },
  contactIdCard: {
    type: String,
    required: [true, '身份证号是必填项'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    trim: true
  },
  referrerName: {
    type: String,
    trim: true
  },
  referrerPhone: {
    type: String,
    trim: true
  },
  referrerIdCard: {
    type: String,
    trim: true
  },
  
  // 对接业务及需求
  businessType: {
    type: String,
    required: [true, '对接业务类型是必填项'],
    enum: ['', '采购', '技术', '市场', '政策', '其他'],
    default: ''
  },
  demandDescription: {
    type: String,
    required: [true, '需求描述是必填项'],
    trim: true
  },
  budgetRange: {
    type: String,
    enum: ['', '面议', '1万内', '1-5万', '5-20万', '20万以上'],
    default: ''
  },
  
  // 材料上传
  files: [
    {
      name: {
        type: String,
        trim: true
      },
      type: {
        type: String,
        trim: true
      },
      size: {
        type: Number
      },
      url: {
        type: String,
        trim: true
      }
    }
  ],
  
  // 审核信息
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: String,
    trim: true
  },
  approvedAt: {
    type: Date
  },
  approvalNote: {
    type: String,
    trim: true
  },
  
  // 元数据
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    trim: true
  }
});

const FormData = mongoose.model('FormData', FormDataSchema);

module.exports = FormData;
