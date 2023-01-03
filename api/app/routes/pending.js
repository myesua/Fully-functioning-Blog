const express = require('express');
const Pending = require('../controllers/pending');

const router = express.Router();

//CREATE
router.post('/new', Pending.create);

// UPDATE
router.put('/:id', Pending.update);

//VIEW
router.get('/:id', Pending.view);

//READ
router.get('/article/:slug', Pending.readBySlug);

//DELETE
router.delete('/:id', Pending.delete);

//SHOW
router.get('/', Pending.show);

module.exports = router;
