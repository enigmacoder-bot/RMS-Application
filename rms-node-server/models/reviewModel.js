const db = require('../config/database');
const moment = require('moment')

const Review = {
  create: (review, callback) => {
    const { reviewid, userid, postid, comment,ratings,createdOn } = review;
    db.run(
      `INSERT INTO reviews (reviewid, userid, postid,comment,ratings,createdOn) VALUES (?, ?, ?, ?, ?,?)`,
      [reviewid, userid, postid, comment,ratings,createdOn],
      function (err) {
        if (err) return callback(err);
        callback(null, { reviewid });
      }
    );
  },

  findByPostId: (postid, callback) => {
    db.all(`SELECT reviews.*, user.username, user.email,user.profileIcon 
      FROM reviews 
      JOIN user ON reviews.userid = user.userid 
      WHERE reviews.postid = ?`, [postid], (err, rows) => {
      callback(err, rows);
    });
  },

  updateReview:(review,callback) =>{
    const { reviewid,comment,ratings} = review;
    const createdOn = moment().format('L')
    db.run(`UPDATE reviews SET comment =?, ratings=?, createdOn =? WHERE reviewid =?`,[comment,ratings,createdOn,reviewid],(err)=>{
      if(err) return callback(err);
      callback(null)
    })
  },

  findByUserId:(reviewid,callback) =>{
    db.all(`SELECT * FROM reviews WHERE userid = ?`,[userid],(err,rows)=>{
      callback(err,rows)
    })
  },

  delete: (reviewid, callback) => {
    db.run(`DELETE FROM reviews WHERE reviewid = ?`, [reviewid], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = Review;
