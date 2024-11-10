const multer = require('multer');

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit (adjust as needed)
  },
}).array('image', 10); // Limit to 10 images (adjust as needed)

module.exports = upload;