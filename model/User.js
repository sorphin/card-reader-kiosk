const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  mongoose.Schema({
    name: { type: String, index: true, trim: true },
    number: { type: String, index: true, uppercase: true, trim: true },
    email: { type: String, trim: true }
  })
);
