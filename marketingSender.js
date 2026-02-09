const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/**
 * Send Marketing Template with Video + Name variable
 * @param {string} to - phone number (no +)
 * @param {string} name - value for {{1}}
 */
async function sendMarketingTemplate(to, name) {
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
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: name
                }
              ]
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Marketing template sent", {
      to,
      name,
      messageId: response.data?.messages?.[0]?.id,
      timestamp: new Date().toISOString()
    });

    return response.data;
  } catch (error) {
    console.error("❌ Marketing template failed", {
      to,
      name,
      status: error.response?.status,
      error: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });

    return null;
  }
}

module.exports = { sendMarketingTemplate };
