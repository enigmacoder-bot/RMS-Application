const db = require('../config/database');
const uuid = require('uuid')
const moment = require('moment')
const {convertFileToBase64,removeDoubleQuotes} = require('../utilities/operations')

const Post = {
  create: async (post, callback) => {
    post = await removeDoubleQuotes(post)
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
    const date = moment().format('L'); // Current date
    try {
      db.run(
        `INSERT INTO post (postid, userid, category, postName, AdditionalName, description, subcategory, tags, date, ratings) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [postid, userid, category, postName, AdditionalName, description, subcategory, tags, date, ratings],
        async function (err) {
          if (err) return callback(err);

          // If images exist, insert them into the 'postImage' table
          if (images && images.length > 0) {
            const imageArray = images.split(',')
            for (const image of imageArray) {
              const postimageid = uuid.v4(); // Generating unique id for each image

              const imageBuffer = Buffer.from(image, 'base64'); // Convert to Buffer

              db.run(
                `INSERT INTO postImage (postimageid, postid, image, createdOn) VALUES (?, ?, ?, ?)`,
                [postimageid, postid, imageBuffer, date],
                function (err) {
                  if (err) return callback(err);
                }
              );
             }
          }
          callback(null, { postid });
        }
      );
    } catch (error) {
      callback(error);
      console.log(error) // Catch any unexpected errors
    }
  },

  findById: (postid, callback) => {
    db.get(`SELECT * FROM post WHERE postid = ?`, [postid], (err, postRow) => {
      if (err) return callback(err);
  
      if (!postRow) return callback(null, null); // No post found
  
      // Query to get associated images
      db.all(`SELECT image FROM postImage WHERE postid = ?`, [postid], (err, imageRows) => {
        if (err) return callback(err);
  
        // Map imageRows to an array of image URLs
        const images = imageRows.map(row => row.image);
  
        // Combine post details and images
        const post = { ...postRow, images };
        callback(null, post);
      });
    });
  },
  

  update: async (postid, post, callback) => {
    post = await removeDoubleQuotes(post)
    const {
      category,
      postName,
      AdditionalName,
      description,
      subcategory,
      tags,
      date,
      ratings,
      images,
    } = post;
    db.run(
      `UPDATE post SET category = ?, postName = ?, AdditionalName = ?, description = ?, subcategory = ?, tags = ?, date = ?, ratings = ? WHERE postid = ?`,
      [category, postName, AdditionalName, description, subcategory, tags, date, ratings, postid],
      function (err) {
        if (err) return callback(err);
  
        // If there are images, we need to update the images in the postImage table
        if (images && images.length > 0) {
          const imageArray = images.split(',');
  
          // First, fetch the existing images
          db.all(`SELECT postimageid FROM postImage WHERE postid = ?`, [postid], (err, rows) => {
            if (err) return callback(err);
  
            // Delete existing images
            const deletePromises = rows.map(row => {
              return new Promise((resolve, reject) => {
                db.run(`DELETE FROM postImage WHERE postimageid = ?`, [row.postimageid], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              });
            });
  
            // Once all deletions are done, insert new images
            Promise.all(deletePromises)
              .then(() => {
                const insertPromises = imageArray.map((image) => {
                  return new Promise((resolve, reject) => {
                    const postimageid = uuid.v4(); // Generating unique id for each image
                    const imageBuffer = Buffer.from(image, 'base64'); // Convert to Buffer
  
                    db.run(
                      `INSERT INTO postImage (postimageid, postid, image, createdOn) VALUES (?, ?, ?, ?)`,
                      [postimageid, postid, imageBuffer, date],
                      function (err) {
                        if (err) return reject(err);
                        resolve();
                      }
                    );
                  });
                });
  
                // Wait for all inserts to finish
                return Promise.all(insertPromises);
              })
              .then(() => {
                // All updates (post details, images) are done, call the callback
                callback(null);
              })
              .catch((err) => {
                callback(err); // If any error happens during delete or insert
              });
          });
        } else {
          // If no images, just complete the post update
          callback(null);
        }
      }
    );
  },
  
  delete: (postid, callback) => {
    db.run(`DELETE FROM post WHERE postid = ?`, [postid], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },

  findByCategory: (category,key, callback) => {
    db.all(`SELECT * FROM post WHERE category LIKE ?`, [`%${category}%`], (err, postRows) => {
      if (err) return callback(err);
      key = String(key).toLowerCase()
      const filteredPostRows = postRows.filter((row)=>{
        if(String(row.postName).toLowerCase() === key || key.includes(String(row.postName).toLowerCase())){ return row}
        else if(key === String(row.AdditionalName).toLowerCase() || key.includes(String(row.AdditionalName).toLowerCase())){return row}
        else if(String(row.description).toLowerCase().includes(key)){return row}
        else if(String(row.tags).toLowerCase().split(';').includes(key)){return row}
        else if(String(row.subcategory).toLowerCase().split(';').includes(key)){return row}
      })
      if (!filteredPostRows || filteredPostRows.length === 0) return callback(null, []); // No posts found
      const postsWithImages = [];
      const getImagesForPost = (post, done) => {
        db.all(`SELECT image FROM postImage WHERE postid = ?`, [post.postid], (err, imageRows) => {
          if (err) return done(err);
          const images = imageRows.map(row => row.image);
          postsWithImages.push({ ...post, images });
          done(null);
        });
      };

      // Fetch images for each post asynchronously
      const tasks = filteredPostRows.map(post => {
        return new Promise((resolve, reject) => {
          getImagesForPost(post, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });

      // Wait for all posts to have their images retrieved
      Promise.all(tasks)
        .then(() => callback(null, postsWithImages))
        .catch(callback);
    });
  },


  findByUserid: (userid, callback) => {
    db.all(`SELECT * FROM post WHERE userid =?`, [userid], (err, postRows) => {
      if (err) return callback(err);

      if (!postRows || postRows.length === 0) return callback(null, []); // No posts found
      const postsWithImages = [];
      const getImagesForPost = (post, done) => {
        db.all(`SELECT image FROM postImage WHERE postid = ?`, [post.postid], (err, imageRows) => {
          if (err) return done(err);

          const images = imageRows.map(row => row.image);
          postsWithImages.push({ ...post, images });
          done(null);
        });
      };

      // Fetch images for each post asynchronously
      const tasks = postRows.map(post => {
        return new Promise((resolve, reject) => {
          getImagesForPost(post, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });

      // Wait for all posts to have their images retrieved
      Promise.all(tasks)
        .then(() => callback(null, postsWithImages))
        .catch(callback);
    });
  },


  updateRatings:(post,callback) =>{
    const {postid,ratings} = post;
    db.run(`UPDATE posts SET ratings =? WHERE postid =?`,[ratings,postid],(err)=>{
      if(err) return callback(err)
      callback(null)
    })
  }

};

module.exports = Post;
