const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./rms.db',sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      userid TEXT PRIMARY KEY,
      username TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      createdOn TEXT,
      isGoogleLogin BOOLEAN,
      isAdmin BOOLEAN,
      profileIcon TEXT
    );
  `);

  db.run(`
    CREATE TABLE  IF NOT EXISTS post (
      postid TEXT PRIMARY KEY,
      userid TEXT,
      category TEXT,
      postName TEXT,
      AdditionalName TEXT,
      description TEXT,
      subcategory TEXT,
      tags TEXT,
      date TEXT,
      ratings REAL,
      createdOn TEXT,
      FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS postImage (
      postimageid TEXT PRIMARY KEY ,
      postid TEXT,
      image BLOB,
      createdOn TEXT,
      FOREIGN KEY (postid) REFERENCES post(postid) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      reviewid TEXT PRIMARY KEY,
      userid TEXT,
      postid TEXT,
      comment TEXT,
      ratings INTEGER,
      createdOn TEXT,
      FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
      FOREIGN KEY (postid) REFERENCES post(postid) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS category (
      cid INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT,
      sublabel TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS FEEDBACK (
    feedbackid TEXT,
    userid TEXT,
    postid TEXT,
    reason TEXT,
    comments TEXT
    priority TEXT,
    createdOn TEXT,
    readed false,
    FOREIGN KEY(userid) REFERENCES user(userid) ON DELETE CASCADE,
    FOREIGN KEY(postid) REFERENCES posts(postid) ON DELETE CASCADE
    );`);
});

module.exports = db;
