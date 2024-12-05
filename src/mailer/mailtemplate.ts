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

interface NewEmployeeTemplateParams {
  fullName: string;
  autoGeneratedPassword: string;
  role: string;
  email: string;
}
export const newEmployeeTemplate = ({
  fullName,
  role,
  email,
  autoGeneratedPassword,
}: NewEmployeeTemplateParams) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      body { 
        width: 100% !important; 
        padding: 0 !important; 
      }
      .container { 
        padding: 15px !important; 
      }
      .login-btn { 
        width: 100% !important; 
        font-size: 16px; /* Adjusted font size for small screens */
        font-color: white; /* Adjusted font color for small screens */
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2c3e50;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f7f9;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .container {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 6px 15px rgba(59, 130, 246, 0.1);
      padding: 30px;
    }
    h1 {
      color: #3b82f6;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
      margin-bottom: 20px;
      text-align: center;
    }
    ul {
      background-color: #f1f4f8;
      border-left: 5px solid #3b82f6;
      padding: 15px 15px 15px 30px;
      border-radius: 4px;
    }
    li {
      margin-bottom: 10px;
      list-style-type: none;
      color: #34495e;
    }
    li strong {
      color: #3b82f6;
      display: inline-block;
      width: 120px;
    }
    .login-btn {
      display: block;
      background-color: #3b82f6;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
      text-align: center;
      width: 100%; /* Set to 100% for full-width responsiveness */
      max-width: 200px; /* Optional max-width for larger screens */
      margin-left: auto;
      margin-right: auto; /* Center align button */
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Our Company!</h1>
<p>Hello ${(
  fullName.charAt(0).toUpperCase() + fullName.slice(1)
).toUpperCase()},</p>
    <p>We're excited to have you join our team. Your account has been created with the following details:</p>
    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Login Password:</strong> ${autoGeneratedPassword}</li>

    </ul>
    <p>Please log in to our system to complete your profile and get started.</p>
    <a href="/api/auth/login" class="login-btn">Log In</a>
  </div>
</body>
</html>
`;

export const companyRegistrationTemplate = (
  companyName: string,
  adminName: string,
  email: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      body { 
        width: 100% !important; 
        padding: 0 !important; 
      }
      .container { 
        padding: 15px !important; 
      }
      .login-btn { 
        width: 100% !important; 
        font-size: 16px; 
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2c3e50;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f7f9;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .container {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 6px 15px rgba(59, 130, 246, 0.1);
      padding: 30px;
    }
    h1 {
      color: #3b82f6;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
      margin-bottom: 20px;
      text-align: center;
    }
    ul {
      background-color: #f1f4f8;
      border-left: 5px solid #3b82f6;
      padding: 15px 15px 15px 30px;
      border-radius: 4px;
    }
    li {
      margin-bottom: 10px;
      list-style-type: none;
      color: #34495e;
    }
    li strong {
      color: #3b82f6;
      display: inline-block;
      width: 150px;
    }
    .login-btn {
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
    <h1>Welcome to Our Platform!</h1>
    <p>Dear ${adminName.charAt(0).toUpperCase()},</p>
    <p>We're thrilled to welcome your company, <strong>${companyName}</strong>, to our platform.</p>
    <p>Here are the details of your registration:</p>
    <ul>
      <li><strong>Administrator Name:</strong> ${adminName}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
    <p>To start managing your company's account, please log in to your dashboard using the link below:</p>
    <a href="/api/auth/login" class="login-btn">Log In</a>
  </div>
</body>
</html>
`;
