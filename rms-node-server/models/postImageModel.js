const db = require("../config/database");

const PostImage = {
  // Create a new post image
  create: (postImage, callback) => {
    const { postimageid, postid, image, createdOn } = postImage;
    db.query(
      `INSERT INTO postImage (postimageid, postid, image, createdOn) VALUES (?, ?, ?, ?)`,
      [postimageid, postid, image, createdOn],
      (err, result) => {
        if (err) return callback(err);
        callback(null, { postimageid });
      }
    );
  },

  // Find all images for a given post ID
  findByPostId: (postid, callback) => {
    db.query(`SELECT * FROM postImage WHERE postid = ?`, [postid], (err, rows) => {
      callback(err, rows);
    });
  },

  // Delete a post image by postimageid
  delete: (postimageid, callback) => {
    db.query(`DELETE FROM postImage WHERE postimageid = ?`, [postimageid], (err, result) => {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = PostImage;
