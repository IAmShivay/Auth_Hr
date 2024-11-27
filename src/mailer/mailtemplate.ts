export const passwordResetRequestedTemplate = (resetDetails: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      body { width: 100% !important; padding: 0 !important; }
      .container { padding: 15px !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2c3e50;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f7f9;
    }
    .container {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 6px 15px rgba(59, 130, 246, 0.1);
      padding: 30px;
    }
    h1 {
      color: #3b82f6;
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    p {
      margin-bottom: 10px;
    }
    .reset-btn {
      display: block;
      background-color: #3b82f6;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
      text-align: center;
      width: 100%;
      max-width: 200px;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hello ${resetDetails.name},</p>
    <p>We received a request to reset your password. If this was you, click the button below:</p>
    <a href="${resetDetails.resetLink}" class="reset-btn">Reset Password</a>
    <p>If you did not request this, you can safely ignore this email.</p>
  </div>
</body>
</html>
`;
