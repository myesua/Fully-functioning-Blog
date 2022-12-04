const express = require('express');
const Tip = require('../controllers/tips');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');

//CREATE
router.post('/new', authenticate, Tip.create);

// UPDATE
router.put('/:id', authenticate, Tip.update);

//VIEW
router.get('/:id', Tip.view);

//READ
router.get('/tip/:slug', Tip.readBySlug);

//DELETE
router.delete('/:id', authenticate, Tip.delete);

//SHOW
router.get('/', Tip.show);

module.exports = router;
