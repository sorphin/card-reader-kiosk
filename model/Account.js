const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Account",
  mongoose.Schema(
    {
      id: String,
      name: String,
      nNumber: String,
      checkins: [
        mongoose.Schema({
          nNumber: String,
          created: { type: Date, default: Date.now }
        })
      ],
      created: { type: Date, default: Date.now }
    },
    { usePushEach: true }
  )
);
