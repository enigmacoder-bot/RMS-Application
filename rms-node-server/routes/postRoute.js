const express = require('express');
const postController = require('../controllers/postController');
const upload = require('../middleware/storage')
// const deletePost = require('../middleware/deletePost')

const router = express.Router();

router.post('/',upload, postController.createPost);
router.get('/:postid', postController.getPost);
router.put('/:postid',upload, postController.updatePost);
router.delete('/:postid', postController.deletePost);
router.post('/category',postController.findByCategory);
router.post('/ratings',postController.updateRatings);
router.get('/user/:userid',postController.findByUserId);

module.exports = router;
