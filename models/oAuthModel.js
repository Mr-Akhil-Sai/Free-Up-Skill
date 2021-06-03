const mongoose = require("mongoose");

const googleUserSchema = mongoose.Schema({
  googleID: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const googleUser = mongoose.model("googleUser", googleUserSchema);
module.exports = googleUser;
