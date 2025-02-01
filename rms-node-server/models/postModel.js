const db = require("../config/database"); // Import MySQL connection
const uuid = require("uuid");
const moment = require("moment");
const { removeDoubleQuotes } = require("../utilities/operations");

const Post = {
  // Create a new post
  create: async (post, callback) => {
    post = await removeDoubleQuotes(post);
    const {
      userid,
      category,
      postName,
      AdditionalName,
      description,
      subcategory,
      tags,
      images,
      ratings,
    } = post;

    const postid = uuid.v4();
    const date = moment().format("YYYY-MM-DD"); // MySQL Date format

    db.query(
      `INSERT INTO post (postid, userid, category, postName, AdditionalName, description, subcategory, tags, date, ratings) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [postid, userid, category, postName, AdditionalName, description, subcategory, tags, date, ratings],
      async (err, result) => {
        if (err) return callback(err);

        // If images exist, insert them into the 'postImage' table
        if (images && images.length > 0) {
          const imageArray = images.split(",");
          for (const image of imageArray) {
            const postimageid = uuid.v4();

            const imageBuffer = Buffer.from(image, 'base64');

            db.query(
              `INSERT INTO postImage (postimageid, postid, image, createdOn) VALUES (?, ?, ?, ?)`,
              [postimageid, postid, imageBuffer, date],
              (err) => {
                if (err) return callback(err);
              }
            );
          }
        }
        callback(null, { postid });
      }
    );
  },

  // Find a post by ID
  findById: (postid, callback) => {
    db.query(`SELECT * FROM post WHERE postid = ?`, [postid], (err, postRows) => {
      if (err) return callback(err);
      if (!postRows.length) return callback(null, null);

      // Query to get associated images
      db.query(`SELECT image FROM postImage WHERE postid = ?`, [postid], (err, imageRows) => {
        if (err) return callback(err);

        const images = imageRows.map(row => row.image);
        const post = { ...postRows[0], images };
        callback(null, post);
      });
    });
  },

  // Update a post
  update: async (postid, post, callback) => {
    post = await removeDoubleQuotes(post);
    const { category, postName, AdditionalName, description, subcategory, tags, date, ratings, images } = post;

    db.query(
      `UPDATE post SET category = ?, postName = ?, AdditionalName = ?, description = ?, 
       subcategory = ?, tags = ?, date = ?, ratings = ? WHERE postid = ?`,
      [category, postName, AdditionalName, description, subcategory, tags, date, ratings, postid],
      (err, result) => {
        if (err) return callback(err);

        // If images exist, update them in the 'postImage' table
        if (images && images.length > 0) {
          const imageArray = images.split(",");

          // Delete existing images
          db.query(`DELETE FROM postImage WHERE postid = ?`, [postid], (err) => {
            if (err) return callback(err);

            // Insert new images
            const insertPromises = imageArray.map((image) => {
              return new Promise((resolve, reject) => {
                const postimageid = uuid.v4();
                db.query(
                  `INSERT INTO postImage (postimageid, postid, image, createdOn) VALUES (?, ?, ?, ?)`,
                  [postimageid, postid, image, date],
                  (err) => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              });
            });

            Promise.all(insertPromises)
              .then(() => callback(null))
              .catch(callback);
          });
        } else {
          callback(null);
        }
      }
    );
  },

  // Delete a post
  delete: (postid, callback) => {
    // First, delete the images related to this post
    db.query(`DELETE FROM postImage WHERE postid = ?`, [postid], (err) => {
      if (err) return callback(err);
  
      // Now, delete the post itself
      db.query(`DELETE FROM post WHERE postid = ?`, [postid], (err, result) => {
        if (err) return callback(err);
        callback(null);
      });
    });
  },

  // Find posts by category and search key
  findByCategory: (category, key, callback) => {
    db.query(`SELECT * FROM post WHERE category LIKE ?`, [`%${category}%`], (err, postRows) => {
      if (err) return callback(err);
      key = String(key).toLowerCase();

      const filteredPostRows = postRows.filter((row) => {
        if (String(row.postName).toLowerCase() === key || key.includes(String(row.postName).toLowerCase())) return row;
        if (key === String(row.AdditionalName).toLowerCase() || key.includes(String(row.AdditionalName).toLowerCase())) return row;
        if (String(row.description).toLowerCase().includes(key)) return row;
        if (String(row.tags).toLowerCase().split(";").includes(key)) return row;
        if (String(row.subcategory).toLowerCase().split(";").includes(key)) return row;
      });

      if (!filteredPostRows.length) return callback(null, []);

      // Fetch images for each post
      const postsWithImages = [];
      const getImagesForPost = (post, done) => {
        db.query(`SELECT image FROM postImage WHERE postid = ?`, [post.postid], (err, imageRows) => {
          if (err) return done(err);
          postsWithImages.push({ ...post, images: imageRows.map(row => row.image) });
          done(null);
        });
      };

      // Execute all image fetch tasks
      const tasks = filteredPostRows.map(post => new Promise((resolve, reject) => getImagesForPost(post, (err) => (err ? reject(err) : resolve()))));

      Promise.all(tasks)
        .then(() => callback(null, postsWithImages))
        .catch(callback);
    });
  },

  // Find posts by user ID
  findByUserid: (userid, callback) => {
    db.query(`SELECT * FROM post WHERE userid = ?`, [userid], (err, postRows) => {
      if (err) return callback(err);
      if (!postRows.length) return callback(null, []);

      // Fetch images for each post
      const postsWithImages = [];
      const getImagesForPost = (post, done) => {
        db.query(`SELECT image FROM postImage WHERE postid = ?`, [post.postid], (err, imageRows) => {
          if (err) return done(err);
          postsWithImages.push({ ...post, images: imageRows.map(row => row.image) });
          done(null);
        });
      };

      // Execute all image fetch tasks
      const tasks = postRows.map(post => new Promise((resolve, reject) => getImagesForPost(post, (err) => (err ? reject(err) : resolve()))));

      Promise.all(tasks)
        .then(() => callback(null, postsWithImages))
        .catch(callback);
    });
  },

  // Update post ratings
  updateRatings: (post, callback) => {
    const { postid, ratings } = post;
    db.query(`UPDATE post SET ratings = ? WHERE postid = ?`, [ratings, postid], (err, result) => {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = Post;
