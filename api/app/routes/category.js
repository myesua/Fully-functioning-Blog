const express = require('express');
const Category = require('../controllers/categories');

const router = express.Router();
const verify = require('../middlewares/verifyJWT');

//CREATE
router.post('/new', verify, Category.create);

// UPDATE
router.put('/:id', verify, Category.update);

//DELETE
router.delete('/:id', verify, Category.delete);

//VIEW
router.get('/', Category.view);

module.exports = router;
