const db = require('../config/database');

const PostImage = {
  create: (postImage, callback) => {
    const { postimageid, postid, image, createdOn } = postImage;
    db.run(
      `INSERT INTO postImage (postimageid, postid, image, createdOn) VALUES (?, ?, ?, ?)`,
      [postimageid, postid, image, createdOn],
      function (err) {
        if (err) return callback(err);
        callback(null, { postimageid });
      }
    );
  },

  findByPostId: (postid, callback) => {
    db.all(`SELECT * FROM postImage WHERE postid = ?`, [postid], (err, rows) => {
      callback(err, rows);
    });
  },

  delete: (postimageid, callback) => {
    db.run(`DELETE FROM postImage WHERE postimageid = ?`, [postimageid], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = PostImage;
