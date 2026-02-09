const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/**
 * Send Marketing Template (Community Invite)
 * @param {string} to - Phone number in international format (no +)
 */
async function sendMarketingTemplate(to) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "naukri_bazar_english_community_link",
          language: {
            code: "en_US"
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    // ✅ Success log
    console.log("✅ Marketing template sent", {
      to,
      messageId: response.data?.messages?.[0]?.id,
      timestamp: new Date().toISOString()
    });

    return response.data;
  } catch (error) {
    // ❌ Error log
    console.error("❌ Marketing template failed", {
      to,
      status: error.response?.status,
      error: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });

    return null;
  }
}

module.exports = {
  sendMarketingTemplate
};
