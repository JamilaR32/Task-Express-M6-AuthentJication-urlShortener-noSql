const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MYLINK);
  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
