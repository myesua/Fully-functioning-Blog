const express = require('express');
const multer = require('multer');
const { check } = require('express-validator');

const User = require('../controllers/user');

const router = express.Router();
const upload = multer().single('profilePicture');

router.get('/dashboard', User.details);
router.get('/dashboard/notifications', User.showAlerts);
router.delete('/dashboard/notifications', User.deleteAlert);

// UPDATE
router.put('/profile/:id', User.update);
router.patch('/:id', User.updateEmail);

// UPLOAD
router.patch('/upload/:id', upload, User.upload);

//SHOW
router.get('/:id', User.show);

//DELETE
router.delete('/:id', User.delete);

module.exports = router;
