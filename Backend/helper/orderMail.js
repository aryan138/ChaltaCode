const nodemailer = require('nodemailer');
const { crd } = require('../config/cred');

exports.SendMail = async (recipientEmail, subject, htmlContent) => {
  try {
    console.log(crd);

    const mail = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,  
      secure: true, 
      auth: {
        user: crd.user,
        pass: crd.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // console.log('Transporter created');

    const mailOptions = {
      from: crd.user,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    };

    let info = await mail.sendMail(mailOptions);
    console.log(`Invoice Mail sent to ${recipientEmail}`, info.messageId);
    return true;
  } catch (err) {
    console.error(`Failed to send email: ${err}`);
    throw err;
  }
};
