const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../logger');

const transporter = nodemailer.createTransport(config.emailConfig);

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: config.emailConfig.auth.user,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Email sending error:', error);
    throw error;
  }
};

module.exports = sendEmail;