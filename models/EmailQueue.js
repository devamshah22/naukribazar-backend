const mongoose = require("mongoose");

const EmailQueueSchema = new mongoose.Schema(
  {
    payload: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING"
    },
    retryCount: {
      type: Number,
      default: 0
    },
    lastError: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailQueue", EmailQueueSchema);
