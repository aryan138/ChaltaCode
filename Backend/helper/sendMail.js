const nodemailer = require('nodemailer');

exports.SendGreetMail = async ({email,name,pno}) => {
  try {

    const mail = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.CRD_USER,
        pass: process.env.CRD_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: 'aryan1383.be22@chitkara.edu.in',
      to: email,
      subject: 'THANK YOU FOR REGISTERING',
      html: `Hello ${name}, I am Aryan. Your mobile number is ${pno}.`,
    };

    let info = await mail.sendMail(mailOptions);
    console.log(`Invoice Mail sent to ${email}`, info.messageId);
    return true;
  } catch (err) {
    console.log("error in mail", err);
    console.error(`Failed to send email: ${err}`);
    throw err;
  }
};
