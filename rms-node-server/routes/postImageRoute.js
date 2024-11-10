const express = require('express');
const postImageController = require('../controllers/postImageController');
const router = express.Router();

router.post('/', postImageController.addImage);
router.get('/:postid', postImageController.getImagesByPost);
router.delete('/:postimageid', postImageController.deleteImage);

module.exports = router;
