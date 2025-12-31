require("dotenv").config();
const express = require("express");
const cors = require("cors");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// Brevo config
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

app.get("/", (req, res) => {
  res.send("Naukri Bazar Backend Running ✅");
});

app.post("/apply", async (req, res) => {
  const {
    name,
    email,
    phone,
    city,
    jobRole,
  } = req.body;

  if ( !name || !email || !phone || !city || !jobRole) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Naukri Bazar"
      },
      to: [
        {
          email: process.env.ADMIN_EMAIL,
          name: "Admin"
        }
      ],
      subject: `New Job Application: ${jobRole}`,
      htmlContent: `
        <h2>New Job Application</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Job Role:</b> ${jobRole}</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully"
    });

  } catch (error) {
    console.error("BREVO ERROR:", error.response?.body || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send application email"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
