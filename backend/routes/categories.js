const express = require('express');
const router = express.Router();
const { list, create, getBySlug } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', list);
router.get('/:slug', getBySlug);
router.post('/', protect, authorize('admin'), create);

module.exports = router;
