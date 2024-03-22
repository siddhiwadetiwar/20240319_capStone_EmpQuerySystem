require("dotenv").config();
const mongoose = require("mongoose");

async function connectToDatabase() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("Error connecting to database");
      console.log(error);
    });
}

module.exports = { connectToDatabase };
