const { twiliocrd } = require('../config/cred')

const sendAccountCreateGreetWhatsapp = () => {
  console.log(twiliocrd.accountSid)
  const client = require('twilio')(twiliocrd.accountSid, twiliocrd.authToken);
  client.messages.create({
    body: "Message is sent",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+917888593684",
  })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err))
}

module.exports = { sendAccountCreateGreetWhatsapp }; 