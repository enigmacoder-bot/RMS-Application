const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = {
  authenticateToken: (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    token = token.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token.' });
      req.user = user;
      next();
    });
  }
};

module.exports = auth;
