const { sendMail } = require('../config/mailer');
const { deletePostTemplate } = require('../templates/deletePostTemplate');
require('dotenv').config();

const deletePost = {
  deleteByReport: async (req, res, next) => {
    const { username, email, postName, reason } = req.body;

    // Check if reason is provided
    if(reason)
    {
        try {
            const mailObject = {
              from: process.env.OWNER_EMAIL,
              to: email,
              subject: 'Your Post Has Been Deleted',
              html: deletePostTemplate(username, postName),
            };
      
            // Send the email and wait for completion
            await sendMail(mailObject);
            console.log(`Deletion email sent to ${email}`);
      
            // Proceed to the next middleware or route handler
            next();
          } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email notification.' });
          }
    }
  },
};

module.exports = { deletePost };
