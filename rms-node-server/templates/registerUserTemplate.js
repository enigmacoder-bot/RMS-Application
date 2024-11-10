const registerUserTemplate = (name) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Successful Registration</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .header {
                  background-color: #4CAF50;
                  padding: 10px;
                  text-align: center;
                  color: white;
              }
              .header h1 {
                  margin: 0;
              }
              .body {
                  margin: 20px;
                  padding: 20px;
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              .body h5 {
                  font-size: 18px;
                  margin-bottom: 10px;
              }
              .body span {
                  font-size: 16px;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Welcome, ${name}!</h1>
              <img src="https://example.com/welcome-image.jpg" alt="Welcome Image" width="100" style="border-radius: 50%;">
          </div>
          <div class="body">
              <h5>Hello ${name},</h5>
              <p>Thank you for joining us! We're thrilled to have you on board. Have a fantastic day ahead!</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 Company Name. All rights reserved.</p>
          </div>
      </body>
      </html>`;
  };
  
module.exports = {registerUserTemplate};
  