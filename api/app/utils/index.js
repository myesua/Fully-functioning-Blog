const nodemailer = require('nodemailer');
const cloudinary = require('../config/cloudinary');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const path = require('path');

/**
 * @desc Upload File
 */

function uploader(req) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(req, (error, file) => {
      if (error) return reject(error);
      return resolve(file);
    });
  });
}

/**
 * @desc Transport Mail
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * @desc Send verification email
 */
async function sendVerificationEmail(user, password, req, res) {
  try {
    const gToken = user.generateVerificationToken();
    const { token } = gToken;

    // Save the verification token
    await gToken.save();

    // Send verfication email
    let link = `http://${req.headers.host}/api/auth/verify/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.FROM_EMAIL,
      subject: 'Account Verification',
      html: `Hello ${user.firstname}, <p>We got an initial request from you for an account creation with us. Please follow the instructions below to complete the process.</p><ol><li>Your password is ${password}. Please keep it as you will need it for log in after verification. It is highly recommended that you change it once you are verified.</li><li>Click here <a href='${link}'>verify account</a> to verify your account.</li></ol> <p>If you did not request this, please ignore this email.</p> Regards, <br />Bechellente Ltd.`,
    };

    transporter.sendMail(mailOptions, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        success: true,
        code: 200,
        message: 'A verification email has been sent to ' + user.email + '.',
        data: result,
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { transporter, uploader, sendVerificationEmail };
