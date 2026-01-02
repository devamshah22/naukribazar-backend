const EmailQueue = require("../models/EmailQueue");
const sendEmail = require("../services/emailService");

const MAX_RETRIES = 3;

async function processEmailQueue() {
  try {
    // Pick oldest pending job
    const job = await EmailQueue.findOne({ status: "PENDING" }).sort({
      createdAt: 1
    });

    if (!job) return;

    try {
      await sendEmail(job.payload);

      job.status = "SENT";
      job.lastError = null;
      await job.save();

      console.log("✅ Email sent successfully");

    } catch (err) {
      job.retryCount += 1;
      job.lastError = err.message;

      if (job.retryCount >= MAX_RETRIES) {
        job.status = "FAILED";
        console.error("❌ Email permanently failed:", err.message);
      }

      await job.save();
    }

  } catch (error) {
    console.error("❌ Queue processing error:", error.message);
  }
}

module.exports = processEmailQueue;
