const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }, // prevent duplicates
  phno: Number,
  totalreward: { type: Number, default: 0 },
  profilecomplete: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
