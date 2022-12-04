const express = require('express');
const multer = require('multer');
const { check } = require('express-validator');

const User = require('../controllers/user');

const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');

const router = express.Router();
const upload = multer().single('profilePicture');

router.get('/', authenticate, User.index);
router.get('/dashboard', authenticate, User.details);

// ADD NEW USER
// router.post(
//   '/new',
//   [
//     check('email').isEmail().withMessage('Enter a valid email address'),
//     check('firstname')
//       .not()
//       .isEmpty()
//       .withMessage('You first name is required'),
//     check('lastname').not().isEmpty().withMessage('You last name is required'),
//   ],
//   validate,
//   User.store,
// );

// UPDATE
router.put('/:id', authenticate, upload, User.update);

//SHOW
router.get('/:id', authenticate, User.show);

//DELETE
router.delete('/:id', authenticate, User.delete);

module.exports = router;
