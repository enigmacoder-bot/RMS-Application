const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:true,
    auth:{
        user:process.env.OWNER_EMAIL,
        pass:process.env.APP_PASSWORD
    }

});

const sendMail = async (mailDetails, callback) => {
    try {
      const info = await transporter.sendMail(mailDetails)
      callback(info);
    } catch (error) {
      console.log(error);
    } 
  };


module.exports= {sendMail} ;