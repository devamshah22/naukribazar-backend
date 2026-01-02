const SibApiV3Sdk = require("sib-api-v3-sdk");

// Brevo config
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendNaukriBazarEmail(payload) {
  const { jobRole, name, email, phone, city, gender } = payload;

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
      <p><b>Job Role:</b> ${jobRole}</p>
      <p><b>Name:</b> ${name}</p>
      <p><b>Gender:</b> ${gender || "Not specified"}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>City:</b> ${city}</p>
    `
  });
}

module.exports = sendNaukriBazarEmail;
