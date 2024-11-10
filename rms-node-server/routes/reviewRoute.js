const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/', reviewController.addReview);
router.get('/:postid', reviewController.getReviewsByPost);
router.put('/',reviewController.updateReview);
router.delete('/:reviewid', reviewController.deleteReview);

module.exports = router;
