const Users = require('../models/User');
const { transporter } = require('../utils/index');

// === PASSWORD RECOVER AND RESET
/**
 * @route POST /api/auth/recover
 * @desc Recover Password -- 1 - Generates token and sends password reset email
 * @access public
 */
exports.recover = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user)
      return res.status(401).json({
        message: `No user associated with ${email}. Double check your entries and try again.`,
      });

    // Generate and set password reset token
    user.generatePasswordReset();

    // Save the updated user object
    await user.save();

    // Send Password Reset email

    const mailOptions = {
      to: user.email,
      from: process.env.FROM_EMAIL,
      subject: 'Password change request',
      html: `Hello ${user.firstname}, <p>Your reset token is ${user.resetPasswordToken}. Go to <a href='${process.env.CLIENT_URL}/reset'>Reset Password</a> and enter the token to continue with your request. Make sure to use it within the time frame. If you did not initiate this request, please ignore this email and your password will remain unchanged.</p> Regards, <br />Bechellente Ltd.`,
    };

    transporter.sendMail(mailOptions, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        success: true,
        code: 200,
        message: `A reset email has been sent to ${user.email}`,
        data: result,
      });
    });
  } catch (err) {
    return res.status(500).json({
      status: 'FAILED',
      message: err.message,
    });
  }
};

/**
 * @route GET /api/auth/reset
 * @desc Reset Password -- 2 - Validate password reset token and shows the password reset view
 * @access public
 */
exports.resetToken = async (req, res) => {
  try {
    const user = await Users.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(401).json({
        message: 'Reset token is invalid or has expired.',
      });
    res.status(200).json({
      message: 'Token is valid!',
    });
    //Redirect user to form with the email address
    // res.render('reset', { user });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

/**
 * @route POST /api/auth/reset
 * @desc Reset Password -- 3
 * @access public
 */
exports.resetPassword = async (req, res) => {
  try {
    const user = await Users.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(404)
        .json({ message: 'Reset token is invalid or has expired.' });

    // Set the new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user object
    user.save((err) => {
      if (err) return res.status(500).json({ message: err.message });

      // Send email
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Your password has been changed',
        html: `Hello ${user.firstname}, <p> 
        This is a confirmation that the password for your account ${user.email} has just been changed. If you did not effect this change, kindly contact support immediately.</p>
        Regards, <br /> Bechellente Ltd.`,
      };

      transporter.sendMail(mailOptions, (err, result) => {
        if (err) throw err;
        // res.render('success', { user });
        res.status(200).json({
          success: true,
          code: 200,
          message:
            'Your password has been changed! Check your email for reference',
          data: result,
        });
      });
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
