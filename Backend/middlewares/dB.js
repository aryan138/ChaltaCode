const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Db Connected ");
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConnect;
