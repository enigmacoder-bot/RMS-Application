const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const passport = require('../config/passport');
const router = express.Router();

router.use(passport.initialize());
// router.use(passport.session());

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
   const token = req.user.token
  res.redirect(`http://localhost:4200/auth/google/callback?token=${token}`);
});

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', auth.authenticateToken, userController.getUser);
router.put('/profile', auth.authenticateToken, userController.updateUser);
router.delete('/profile', auth.authenticateToken, userController.deleteUser);
router.post('/search',userController.getUserByName);

module.exports = router;
