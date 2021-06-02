const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`mongo DB connected: ${con.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

module.exports = connectDB;
