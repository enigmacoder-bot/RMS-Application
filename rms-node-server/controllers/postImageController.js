const PostImage = require('../models/postImageModel');

const postImageController = {
  addImage: (req, res) => {
    PostImage.create(req.body, (err, image) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json(image);
    });
  },

  getImagesByPost: (req, res) => {
    PostImage.findByPostId(req.params.postid, (err, images) => {
      if (err || !images) return res.status(404).json({ error: 'Images not found' });
      res.json(images);
    });
  },

  deleteImage: (req, res) => {
    PostImage.delete(req.params.postimageid, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Image deleted successfully' });
    });
  },
};

module.exports = postImageController;
