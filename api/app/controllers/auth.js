const Users = require('../models/User');
const bcrypt = require('bcrypt');
const Token = require('../models/Token');
const passport = require('passport');

const { transporter, sendVerificationEmail } = require('../utils/index');

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access public
 */
exports.register = async (req, res) => {
  try {
    const { email } = req.body;

    // Make sure this account doesn't already exist
    const user = await Users.findOne({ email });

    if (user)
      return res.status(401).json({
        message:
          'The email address you have entered is already associated with another account.',
      });

    const password = '_' + Math.random().toString(36).substr(2, 9); //generate a random password
    const newUser = new Users({ ...req.body, password });

    const user_ = await newUser.save();

    //Generate and set password reset token
    // user_.generatePasswordReset();

    // Save the updated user object
    // await user_.save();

    //Get mail options
    await sendVerificationEmail(user_, password, req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route POST api/auth/login
 * @desc Login user and return token
 * @access public
 */

exports.login = async (req, res, next) => {
  try {
    // Make sure this account exists
    const user = await Users.findOne({ email: req.body.email }).select(
      '+password',
    );
    if (!user)
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    // Validate password
    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Make sure user has been verified
    if (!user.isVerified)
      return res.status(401).json({
        type: 'no-verified',
        message: 'Your account has not been verified.',
      });

    let options = {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
    };

    const token = user.generateJWT();

    res.cookie('UserSession', token, options);

    // Login user, write token, and send back user
    const { password, ...data } = user._doc;
    res.status(200).json({ hash: token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.check = async (req, res, next) => {
  const cookie = req.cookies['UserSession'];
  if (!cookie) {
    res.status(403).json('You are forbidden to access this page.');
  } else {
    res.redirect('/');
    next();
  }
};

const getToken = (token) => {
  return token;
};

// exports.getAccess = (req, res, next, access) => {
//   console.log(access);
//   if (!access) {
//     console.log('token: undefined');
//   }
//   req.headers.authorization = 'Bearer ' + access;
//   next();
// };

/**
 * @route POST api/veify/:token
 * @desc Verify Token
 * @access public
 */

exports.verify = async (req, res, next) => {
  if (!req.params.token)
    return res.status(400).json({
      message: 'We are unable to find a user for this token. Please try again.',
    });

  try {
    // Find a matching token
    const token = await Token.findOne({ token: req.params.token });

    if (!token)
      return res.status(400).json({
        message:
          'We are unable to find a valid token. Your token may have expired. Please try again!',
      });

    // Find a matching user if token is valid
    Users.findOne({ _id: token._id }, (err, user) => {
      if (!user)
        return res.status(400).json({
          message:
            'We are unable to find a user for this token. Please try again!',
        });

      if (user.isVerified)
        return res
          .status(400)
          .json({ message: 'This user has already been verified!' });

      user.isVerified = true;
      user.save((err) => {
        if (err) return res.status(500).json({ message: err.message });
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: 'This account has been verified! Please log in.',
        });
      });

      // Send confirmation email
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Welcome to Bechellente!',
        html: `Hello ${user.firstname}, <p>We are happy to have you join us in this exciting journey. This is to confirm that your account has been successfully verified. Please log in to change the randomly generated password to a more secure one.</p> Regards, <br />Bechellente Ltd.`,
      };

      transporter.sendMail(mailOptions, (err, result) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          code: 200,
          message:
            'Confirmation email successfully sent to ' + user.email + '.',
          data: result,
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      code: 500,
      message: err.message,
    });
  }
};

/**
 * @route POST api/resend/
 * @desc Resend verification token
 * @access public
 */
exports.resend = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({
        message: `This email address ${req.body.email} is not associated with any account`,
      });

    if (user.isVerified)
      return res.status(400).json({
        message: 'This account has already been verified. Please log in.',
      });
    await sendVerificationEmail(user, req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
