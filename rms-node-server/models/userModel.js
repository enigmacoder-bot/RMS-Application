const db = require('../config/database');
const bcrypt = require('bcryptjs');
const uuid = require('uuid')
const moment = require('moment')
const {randomizeUsername}  = require('../utilities/operations');
const { findByUserId } = require('./reviewModel');

const User = {
  create: async (user, callback) => {
    const userid = uuid.v4();
    const createdOn = moment().format('L')
    let hashedPassword=""
    let { email,username, password,isGoogleLogin, isAdmin, profileIcon } = user;
      if(username === undefined){ username = await randomizeUsername(email) }
    if(password !=="")
    {
     hashedPassword = bcrypt.hashSync(password, 10);
    }
    else{
      hashedPassword=""
    }
    db.run(
      `INSERT INTO user (userid, username, email, password, createdOn, isGoogleLogin, isAdmin, profileIcon) VALUES (?, ?, ?, ?, ?, ?,?,?)`,
      [userid, username, email, hashedPassword, createdOn,isGoogleLogin, isAdmin, profileIcon],
      function (err) {
        if (err) return callback(err);
        callback(null, { userid:userid,username:username,email:email,isAdmin:isAdmin,profileIcon:profileIcon,createdOn:createdOn });
      }
    );
  },

  findByEmail: (email, callback) => {
    db.get(`SELECT * FROM user WHERE email = ?`, [email], (err, row) => {
      callback(err, row);
    });
  },

  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  },

  findById: (userid, callback) => {
    db.get(`SELECT * FROM user WHERE userid = ?`, [userid], (err, row) => {
      callback(err, row);
    });
  },


  findUserByName:(key,callback) => {
    const searchKey = `%${key}%`; 
    db.all(`SELECT * FROM user WHERE username LIKE ? OR email LIKE ?`,[searchKey,searchKey],(err,rows)=>{
      if(err) return callback(err);
      callback(null,rows)
    })
  },



  update: (userid, user, callback) => {
    const { username, profileIcon } = user;
    db.run(
      `UPDATE user SET username = ?, profileIcon = ? WHERE userid = ?`,
      [username, profileIcon, userid],
      function (err) {
        db.get(`SELECT * FROM user where userid =?`,[userid],(err,updatedUser) =>{
          if (err) return callback(err);
          callback(null,updatedUser);
        })
      }
    );
  },


  delete: (userid, callback) => {
    db.run(`DELETE FROM user WHERE userid = ?`, [userid], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },
};



module.exports = User;
