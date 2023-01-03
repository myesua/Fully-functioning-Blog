const express = require('express');
const { check } = require('express-validator');

const validate = require('../middlewares/validate');
const Auth = require('../controllers/auth');
const Password = require('../controllers/password');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      code: 200,
      message:
        'Welcome to the Auth endpoint! Register or login for authentication',
      data: {},
    },
  });
});

router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('firstname')
      .not()
      .isEmpty()
      .withMessage('You first name is required'),
    check('lastname').not().isEmpty().withMessage('You last name is required'),
  ],
  validate,
  Auth.register,
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty(),
  ],
  validate,
  Auth.login,
);

// REFRESH TOKEN
router.get('/refresh', Auth.refresh);

//EMAIL Verification
router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resend);

//Password RESET
router.post(
  '/recover',
  [check('email').isEmail().withMessage('Enter a valid email address')],
  validate,
  Password.recover,
);

router.post('/reset-token', Password.resetToken);

router.post(
  '/reset',
  [
    check('password')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage('Must be at least 8 chars long'),
    check('confirmPassword', 'Passwords do not match').custom(
      (value, { req }) => value === req.body.password,
    ),
  ],
  validate,
  Password.resetPassword,
);

// LOGOUT
router.post('/logout', Auth.logout);

module.exports = router;
