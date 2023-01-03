const express = require('express');
const Rejected = require('../controllers/rejected');

const router = express.Router();

// UPDATE
router.put('/:id', Rejected.update);

//VIEW
router.get('/:id', Rejected.view);

//READ
router.get('/article/:slug', Rejected.readBySlug);

//DELETE
router.delete('/:id', Rejected.delete);

//SHOW
router.get('/', Rejected.show);

module.exports = router;
