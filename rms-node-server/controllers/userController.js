const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {registerUserTemplate }= require('../templates/registerUserTemplate')
const {sendMail} = require('../config/mailer')

const userController = {
  registerUser: (req, res) => {
    User.create(req.body, (err, user) => {
      if (err)return res.status(401).json({ error: 'Email Id already exist !' });
      const token = jwt.sign({ userid: user.userid, email: user.email,username:user.username,isAdmin:user.isAdmin,profileIcon:user.profileIcon,createdOn:user.createdOn }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
      sendMail({
        from: "kumarmanvith0@gmail.com",
        to: user.email,
        subject: "Welcome Dear Traveller",
        text: "Hello Traveller",
        html: registerUserTemplate(user.username),
      },()=>{
        console.log("Mail Sent Successfully")
      })
    });
  },

loginUser: (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ error: 'Incorrect password' });

      const token = jwt.sign({ userid: user.userid, email: user.email,username:user.username,isAdmin:user.isAdmin,profileIcon:user.profileIcon,createdOn:user.createdOn }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
},

getUser: (req, res) => {
  User.findById(req.user.userid, (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
},

getUserByName : (req,res) =>{
  User.findUserByName(req.body.searchKey,(err,userrows)=>{
    if(err || !userrows) return res.status(404).json({ error:'User not found'});
    res.json(userrows)
  })
},


updateUser: (req, res) => {
  User.update(req.user.userid, req.body, (err,user) => {
    if (err) return res.status(400).json({ error: err.message });
    const token = jwt.sign({ userid: user.userid, email: user.email,username:user.username,isAdmin:user.isAdmin,profileIcon:user.profileIcon,createdOn:user.createdOn }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
},

deleteUser: (req, res) => {
  User.delete(req.user.userid, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
},
};

module.exports = userController;
