const express = require('express');
const Category = require('../controllers/categories');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');

//CREATE
router.post('/new', authenticate, Category.create);

// UPDATE
router.put('/:id', authenticate, Category.update);

//DELETE
router.delete('/:id', authenticate, Category.delete);

//VIEW
router.get('/', Category.view);

module.exports = router;
