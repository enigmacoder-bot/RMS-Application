const db = require("../config/database");
const moment = require("moment");

const Review = {
  // Create a new review
  create: (review, callback) => {
    const { reviewid, userid, postid, comment, ratings, createdOn } = review;
    db.query(
      `INSERT INTO reviews (reviewid, userid, postid, comment, ratings, createdOn) VALUES (?, ?, ?, ?, ?, ?)`,
      [reviewid, userid, postid, comment, ratings, createdOn],
      (err, result) => {
        if (err) return callback(err);
        callback(null, { reviewid });
      }
    );
  },

  // Find reviews by post ID
  findByPostId: (postid, callback) => {
    db.query(
      `SELECT reviews.*, user.username, user.email, user.profileIcon 
       FROM reviews 
       JOIN user ON reviews.userid = user.userid 
       WHERE reviews.postid = ?`,
      [postid],
      (err, rows) => {
        callback(err, rows);
      }
    );
  },

  // Update a review
  updateReview: (review, callback) => {
    const { reviewid, comment, ratings } = review;
    const createdOn = moment().format("YYYY-MM-DD HH:mm:ss"); // MySQL-friendly date format

    db.query(
      `UPDATE reviews SET comment = ?, ratings = ?, createdOn = ? WHERE reviewid = ?`,
      [comment, ratings, createdOn, reviewid],
      (err, result) => {
        if (err) return callback(err);
        callback(null);
      }
    );
  },

  // Find reviews by user ID (Fixed incorrect variable usage)
  findByUserId: (userid, callback) => {
    db.query(`SELECT * FROM reviews WHERE userid = ?`, [userid], (err, rows) => {
      callback(err, rows);
    });
  },

  // Delete a review by review ID
  delete: (reviewid, callback) => {
    db.query(`DELETE FROM reviews WHERE reviewid = ?`, [reviewid], (err, result) => {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = Review;
