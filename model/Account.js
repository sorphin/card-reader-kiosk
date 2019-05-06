const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Account",
  mongoose.Schema(
    {
      id: String,
      name: String,
      nNumber: { type: String, index: true, uppercase: true, trim: true },
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
