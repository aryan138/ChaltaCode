const sendAccountCreateGreetSms = () => {
  // console.log(twiliocrd.accountSid)
  const client = require('twilio')(process.env.TIWILIO_ID, process.env.TIWILIO_TOKEN);
  client.messages.create({
    body: "Message is sent to aryan",
    from: "+19789535036",
    to: "+918628825068",
  })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err))
}

module.exports = { sendAccountCreateGreetSms };