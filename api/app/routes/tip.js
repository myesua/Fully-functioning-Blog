const express = require('express');
const Tip = require('../controllers/tips');

const router = express.Router();
const verify = require('../middlewares/verifyJWT');

//CREATE
router.post('/new', verify, Tip.create);

// UPDATE
router.put('/:id', verify, Tip.update);

//VIEW
router.get('/:id', Tip.view);

//READ
router.get('/tip/:slug', Tip.readBySlug);

//DELETE
router.delete('/:id', verify, Tip.delete);

//SHOW
router.get('/', Tip.show);

module.exports = router;
