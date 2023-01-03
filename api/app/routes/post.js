const express = require('express');
const Post = require('../controllers/posts');

const router = express.Router();
const verify = require('../middlewares/verifyJWT');

//CREATE
router.post('/new', verify, Post.create);

// UPDATE
router.put('/:id', verify, Post.update);

//VIEW
router.get('/:id', Post.view);

//READ
router.get('/post/:slug', Post.readBySlug);

//DELETE
router.delete('/:id', verify, Post.delete);

//SHOW
router.get('/', Post.show);

module.exports = router;
