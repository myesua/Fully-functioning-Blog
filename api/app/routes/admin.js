const express = require('express');
const Admin = require('../controllers/admin');
const verify = require('../middlewares/verifyJWT');

const router = express.Router();

router.get('/', Admin.index);
router.post('/tasks/article/pending/:id', Admin.approve);
router.post('/tasks/article/reject/:id', Admin.reject);
router.get('/tasks/', Admin.retrieve);

module.exports = router;
