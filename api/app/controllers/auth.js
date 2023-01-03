const Users = require('../models/User');
const bcrypt = require('bcrypt');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');

const Notification = require('../models/Notification');
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
      maxAge: 24 * 60 * 60 * 1000, // would expire after an hour
      httpOnly: true, // The cookie only accessible by the web server
      secure: true,
      sameSite: 'None',
    };

    const token = user.generateAccessJWT();

    res.cookie('SessionID', token, options);

    const { password, ...data } = user._doc;

    res.status(200).json({
      message: 'You have been successfully logged in!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route POST api/auth/refresh
 * @desc Refresh auth token
 * @access public
 */
exports.refresh = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.xrefresh) return res.sendStatus(401);
    const refreshToken = cookies.xrefresh;

    const user = await Users.findOne({ refreshToken: refreshToken });

    if (!user) return res.sendStatus(403);
    const user_id = user._id.toString();
    // If user exists in session, verify session
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user_id !== decoded.id) return res.sendStatus(403);
        const accessToken = user.generateAccessJWT();
        res.status(200).json({ hash: accessToken });
      },
    );
  } catch (err) {
    res.sendStatus(500);
  }
};

/**
 * @route POST api/veify/:token
 * @desc Verify Token
 * @access public
 */

exports.verify = async (req, res) => {
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
      const author = user.firstname + ' ' + user.lastname;
      Notification.findOne(
        {
          author: author,
        },
        (err, notification) => {
          if (!notification) {
            const nT = new Notification({
              alerts: {
                title: 'security',
                text: 'Your account has been successfully verified!',
              },
              author: author,
            });
            nT.save((err) => {
              if (err) return res.status(500).json({ message: err.message });
              return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Notification created successfully!',
              });
            });
          } else {
            notification.pushNotification({
              title: 'security',
              text: 'Your account has been successfully verified!',
            });
            notification.save((err) => {
              if (err) return res.status(500).json({ message: err.message });
              return res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Notification added successfully!',
              });
            });
          }
        },
      );

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
      html: `Hello ${user.firstname}, <p>Please click here <a href='${link}'>confirm</a> to verify your account.</li></ol><p>If you did not request this, please ignore this email.</p> Regards, <br />Bechellente Ltd.`,
    };

    transporter.sendMail(mailOptions, (err, result) => {
      if (err) throw err;
      res.status(200).json({
        success: true,
        code: 200,
        message: 'A verification email has been sent to ' + user.email + '.',
        link: link,
        data: result,
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route POST api/auth/logout
 * @desc Logout user
 * @access public
 */
exports.logout = async (req, res) => {
  try {
    // On client, also delete the request cookie
    const user = req.body.id;

    if (!user) return res.sendStatus(204); //No content

    // Invalidate client's request cookie
    let options = {
      path: '/',
      domain: `${process.env.CLIENT_URL}`,
      maxAge: 'Thu, 01 Jan 1970 00:00:00 UTC', // invalid expiration date
      httpOnly: true, // The cookie only accessible by the web server
      secure: true,
      sameSite: 'None',
    };

    // Is user in db?
    const user_ = await Users.findById(user);

    if (!user_) {
      return res.status(200).json({ message: 'You are logged out!' });
    }

    // Delete user's refreshToken in db
    await Users.findByIdAndUpdate(
      user,
      { $set: { refreshToken: '' } },
      { new: true },
    );
    res.cookie('SessionID', options);
    res.status(200).json({ message: 'You are logged out!' });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', code: 500, message: err.message });
  }
};
