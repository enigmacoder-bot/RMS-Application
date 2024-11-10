const deletePostTemplate = (usename,postName) =>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Deleted Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      color: #333;
    }
    h2 {
      color: #e74c3c;
      font-size: 24px;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
      font-size: 16px;
      margin-bottom: 15px;
    }
    p strong {
      color: #333;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .signature {
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <h2>Post Deleted Due to Inappropriate Reports</h2>
    <p>Dear ${userName},</p>
    <p>We regret to inform you that your post titled "<strong>${postName}</strong>" has been removed from our platform. Our community guidelines are important to maintaining a safe environment, and this post received multiple reports for inappropriate content.</p>
    <p>If you believe this was done in error, please <a href="mailto:support@yourapp.com">contact support</a> with any relevant details, and we’ll be happy to review your case.</p>
    <p>Thank you for understanding and helping us maintain a safe community.</p>
    <br>
    <p>Best regards,</p>
    <p class="signature">Your App Name Team</p>
  </div>
</body>
</html>
`};

module.exports ={ deletePostTemplate }
