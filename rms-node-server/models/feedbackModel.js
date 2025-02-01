const db = require("../config/database"); // Import MySQL connection
const uuid = require("uuid");
const moment = require("moment");

const Feedback = {
  // Create new feedback
  create: (feedback, callback) => {
    const { userid, postid, reason, comments } = feedback;
    const feedbackid = uuid.v4();
    const createdOn = moment().format("YYYY-MM-DD"); // Format for MySQL
    const readed = false;

    const sql = `INSERT INTO FEEDBACK (feedbackid, userid, postid, reason, comments, createdOn, readed) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [feedbackid, userid, postid, reason, comments, createdOn, readed], (err, result) => {
      if (err) return callback(err);
      callback(null, { feedbackid });
    });
  },

  // Get all feedbacks
  findAll: (callback) => {
    db.query("SELECT * FROM FEEDBACK", (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // Delete feedback by ID
  delete: (feedbackid, callback) => {
    db.query("DELETE FROM FEEDBACK WHERE feedbackid = ?", [feedbackid], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows > 0 ? "Deleted Successfully" : "No rows deleted");
    });
  },

  // Update feedback status to 'readed'
  updateReaded: (feedbackid, callback) => {
    db.query("UPDATE FEEDBACK SET readed = 1 WHERE feedbackid = ?", [feedbackid], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows > 0 ? "Updated Successfully" : "No rows updated");
    });
  },

  // Fetch specific feedback details with related user & post info
  fetchFeedback: (feedbackid, callback) => {
    const sql = `
      SELECT f.feedbackid, f.reason, f.comments, f.priority, f.createdOn, f.readed, 
             u.userid, u.username, 
             p.postid, p.postName, p.AdditionalName 
      FROM FEEDBACK f 
      JOIN user u ON f.userid = u.userid 
      JOIN post p ON f.postid = p.postid 
      WHERE f.feedbackid = ?`;

    db.query(sql, [feedbackid], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },
};

module.exports = { Feedback };
