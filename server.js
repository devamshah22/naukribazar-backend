require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- BREVO SMTP ---------- */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
});

/* ---------- API ---------- */
app.post("/register", async (req, res) => {
  try {
    const {
      id,
      name,
      mobile,
      email,
      city,
      workerType,
      gender,
      timestamp,
      status
    } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const mailOptions = {
      from: `"Naukri Bazar" <${process.env.BREVO_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Worker Registration",
      html: `
        <h2>New Registration</h2>
        <p><b>ID:</b> ${id}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Worker Type:</b> ${workerType || "N/A"}</p>
        <p><b>Gender:</b> ${gender}</p>
        <p><b>Status:</b> ${status}</p>
        <p><b>Timestamp:</b> ${new Date(timestamp).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });

  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
