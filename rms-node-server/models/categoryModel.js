const db = require('../config/database');

const Category = {
  create: (category, callback) => {
    const { cid, label, sublabel,icon,description,colorcode,createdOn } = category;
    db.run(
      `INSERT INTO category (cid, label, sublabel,icon,description,colorcode,createdOn) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cid, label, sublabel,icon,description,colorcode,createdOn],
      function (err) {
        if (err) return callback(err);
        callback(null, { cid });
      }
    );
  },

  findAll: (callback) => {
    db.all(`SELECT * FROM category`, [], (err, rows) => {
      callback(err, rows);
    });
  },

  update:(cid,category,callback) =>{
    const {label,sublabel,icon,description,colorcode} = category;
    db.run(`UPDATE category SET label =?, sublabel =?, icon=?, description=?, colorcode=? WHERE cid =?`,[label,sublabel,icon,description,colorcode,cid],(err) => {
      if(err) return callback;
      callback(null);
    })
  },


  delete: (cid, callback) => {
    db.run(`DELETE FROM category WHERE cid = ?`, [cid], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = Category;
