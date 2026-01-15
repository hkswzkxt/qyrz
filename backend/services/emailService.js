const nodemailer = require('nodemailer');
require('dotenv').config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error.message);
  } else {
    console.log('SMTP connection successful');
  }
});

// Render email template with variables
const renderTemplate = (template, data) => {
  let rendered = template;
  // Replace all variables in the template
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value || '');
  }
  return rendered;
};

// Send approval email
const sendApprovalEmail = async (formData, emailConfig) => {
  if (!formData.email) {
    console.error('No email provided for form:', formData._id);
    return;
  }

  try {
    const template = emailConfig.templates.approved;
    const data = {
      contactName: formData.contactName,
      companyName: formData.companyName,
      approvedAt: new Date().toLocaleString('zh-CN'),
      approvalNote: formData.approvalNote || ''
    };

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: formData.email,
      subject: renderTemplate(template.subject, data),
      html: renderTemplate(template.content, data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending approval email:', error.message);
    throw error;
  }
};

// Send rejection email
const sendRejectionEmail = async (formData, emailConfig) => {
  if (!formData.email) {
    console.error('No email provided for form:', formData._id);
    return;
  }

  try {
    const template = emailConfig.templates.rejected;
    const data = {
      contactName: formData.contactName,
      companyName: formData.companyName,
      approvedAt: new Date().toLocaleString('zh-CN'),
      approvalNote: formData.approvalNote || ''
    };

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: formData.email,
      subject: renderTemplate(template.subject, data),
      html: renderTemplate(template.content, data)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending rejection email:', error.message);
    throw error;
  }
};

// Send email based on status
const sendEmailNotification = async (formData, emailConfig) => {
  if (formData.status === 'approved') {
    return await sendApprovalEmail(formData, emailConfig);
  } else if (formData.status === 'rejected') {
    return await sendRejectionEmail(formData, emailConfig);
  }
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendEmailNotification,
  renderTemplate
};
