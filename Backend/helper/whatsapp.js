
const sendAccountCreateGreetWhatsapp = () => {
  // console.log(twiliocrd.accountSid)
  const client = require('twilio')(process.env.TIWILIO_ID, process.env.TIWILIO_);
  client.messages.create({
    body: "Message is sent",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+917888593684",
  })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err))
}

module.exports = { sendAccountCreateGreetWhatsapp }; 