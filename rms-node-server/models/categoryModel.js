const db = require("../config/database"); // Import MySQL connection

const Category = {
  // Create a new category
  create: (category, callback) => {
    const { label, sublabel, icon, description, colorcode, createdOn } = category;
    const sql = `INSERT INTO category (label, sublabel, icon, description, colorcode, createdOn) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [label, sublabel, icon, description, colorcode, createdOn], (err, result) => {
      if (err) return callback(err);
      callback(null, { cid: result.insertId }); // Use `insertId` to get the new category ID
    });
  },

  // Get all categories
  findAll: (callback) => {
    db.query("SELECT * FROM category", (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  // Update a category
  update: (cid, category, callback) => {
    const { label, sublabel, icon, description, colorcode } = category;
    const sql = `UPDATE category SET label = ?, sublabel = ?, icon = ?, description = ?, colorcode = ? WHERE cid = ?`;

    db.query(sql, [label, sublabel, icon, description, colorcode, cid], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows > 0 ? "Updated Successfully" : "No rows updated");
    });
  },

  // Delete a category
  delete: (cid, callback) => {
    db.query("DELETE FROM category WHERE cid = ?", [cid], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows > 0 ? "Deleted Successfully" : "No rows deleted");
    });
  },
};

module.exports = Category;
