const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', postCtrl.list);
router.get('/:id', postCtrl.get);
router.post('/',protect,authorize('author','admin'), postCtrl.create);
router.put('/:id', protect, postCtrl.update);
router.delete('/:id', protect, postCtrl.remove);

module.exports = router;