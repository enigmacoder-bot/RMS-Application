const db = require("../config/database"); // Import MySQL connection
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const moment = require("moment");
const { randomizeUsername } = require("../utilities/operations");

const User = {
  // Create a new user
  create: async (user, callback) => {
    const userid = uuid.v4();
    const createdOn = moment().format("YYYY-MM-DD"); // MySQL Date format
    let hashedPassword = "";
    let { email, username, password, isGoogleLogin, isAdmin, profileIcon } = user;

    if (!username) {
      username = await randomizeUsername(email);
    }

    if (password !== "") {
      hashedPassword = bcrypt.hashSync(password, 10);
    }

    const sql = `INSERT INTO user (userid, username, email, password, createdOn, isGoogleLogin, isAdmin, profileIcon) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [userid, username, email, hashedPassword, createdOn, isGoogleLogin, isAdmin, profileIcon], (err, result) => {
      if (err) return callback(err);
      callback(null, { userid, username, email, isAdmin, profileIcon, createdOn });
    });
  },

  // Find user by email
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM user WHERE email = ?", [email], (err, row) => {
      callback(err, row.length ? row[0] : null); // Return single user
    });
  },

  // Compare passwords
  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  },

  // Find user by ID
  findById: (userid, callback) => {
    db.query("SELECT * FROM user WHERE userid = ?", [userid], (err, row) => {
      callback(err, row.length ? row[0] : null);
    });
  },

  // Search user by name or email
  findUserByName: (key, callback) => {
    const searchKey = `%${key}%`;
    db.query("SELECT * FROM user WHERE username LIKE ? OR email LIKE ?", [searchKey, searchKey], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // Update user details
  update: (userid, user, callback) => {
    const { username, profileIcon } = user;
    const sql = "UPDATE user SET username = ?, profileIcon = ? WHERE userid = ?";

    db.query(sql, [username, profileIcon, userid], (err, result) => {
      if (err) return callback(err);

      // Fetch updated user details
      db.query("SELECT * FROM user WHERE userid = ?", [userid], (err, updatedUser) => {
        if (err) return callback(err);
        callback(null, updatedUser.length ? updatedUser[0] : null);
      });
    });
  },

  // Delete user
  delete: (userid, callback) => {
    db.query("DELETE FROM user WHERE userid = ?", [userid], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows > 0 ? "Deleted Successfully" : "No rows deleted");
    });
  },
};

module.exports = User;
