
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text, html) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: "ADMIN", 
    to, 
    subject,
    text, 
    html,
  });

  return info;
}

module.exports = sendEmail;