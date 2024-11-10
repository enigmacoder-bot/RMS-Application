const Review = require('../models/reviewModel');

const reviewController = {
  addReview: (req, res) => {
    Review.create(req.body, (err, review) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json(review);
    });
  },

  getReviewsByPost: (req, res) => {
    Review.findByPostId(req.params.postid, (err, reviews) => {
      if (err || !reviews) return res.status(404).json({ error: 'Reviews not found' });
      res.json(reviews);
    });
  },

  updateReview:(req,res) =>{
    Review.updateReview(req.body,(err) =>{
      if(err) return res.status(400).json({ error:err.message});
      res.json({message :"Review Updated.."})
    })
  },

  deleteReview: (req, res) => {
    Review.delete(req.params.reviewid, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Review deleted successfully' });
    });
  },
};

module.exports = reviewController;
