const express = require('express');
const Post = require('../controllers/posts');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');

//CREATE
router.post('/new', authenticate, Post.create);

// UPDATE
router.put('/:id', authenticate, Post.update);

//VIEW
router.get('/:id', Post.view);

//READ
router.get('/post/:slug', Post.readBySlug);

//DELETE
router.delete('/:id', authenticate, Post.delete);

//SHOW
router.get('/', Post.show);

module.exports = router;
