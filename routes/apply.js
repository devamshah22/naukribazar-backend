const express = require("express");
const EmailQueue = require("../models/EmailQueue");

const router = express.Router();

router.post("/", async (req, res) => {
  const { jobRole, name, email, phone, city, gender } = req.body;

  if (!jobRole || !name || !email || !phone || !city) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    // 🔁 Push to queue
    await EmailQueue.create({
      payload: {
        jobRole,
        name,
        email,
        phone,
        city,
        gender
      }
    });

    // ✅ Respond immediately
    res.status(200).json({
      success: true,
      message: "Application submitted successfully"
    });

  } catch (error) {
    console.error("❌ Apply route error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to process request"
    });
  }
});

module.exports = router;
