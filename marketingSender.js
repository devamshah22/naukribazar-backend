const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/**
 * Send WhatsApp marketing template
 * Template: naukri_bazar_english_community
 * Language: English (UK) - Uses en_GB code
 * 
 * @param {string} to - Recipient phone number (e.g., '+919876543210')
 * @returns {Promise} API response
 */
async function sendMarketingTemplate(to) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "english_naukri_bazar",
          language: {
            code: "en"
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

    console.log("✅ Marketing template sent successfully", {
      to,
      messageId: response.data?.messages?.[0]?.id,
      status: response.status
    });

    return response.data;
  } catch (error) {
    const errorCode = error.response?.data?.error?.code;
    const errorMsg = error.response?.data?.error?.message;
    
    console.error("❌ Marketing template failed", {
      to,
      status: error.response?.status,
      errorCode,
      errorMsg,
      details: error.response?.data?.error?.error_data
    });

    // Provide helpful hints based on error code
    if (errorCode === 132001) {
      console.log('\n💡 HINT: Template not found in translation');
      console.log('   - Check if template is APPROVED in WhatsApp Manager');
      console.log('   - Verify template name matches exactly');
      console.log('   - Try language code: en_GB, en_US, or just en');
    } else if (errorCode === 1104) {
      console.log('\n💡 HINT: Invalid phone number');
      console.log('   - Format: +{country_code}{number}');
      console.log('   - Example: +919876543210');
    } else if (errorCode === 131008) {
      console.log('\n💡 HINT: Message parameters are invalid');
      console.log('   - Check template variables match what you\'re sending');
    }

    throw error;
  }
}

/**
 * Diagnostic function to check template status
 * Run this to identify the exact issue
 */
async function checkTemplateStatus() {
  try {
    console.log('🔍 Checking template status...\n');

    // Attempt with en
    console.log('📝 Attempting with en...');
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: "919137948393 ", // Replace with your test number
        type: "template",
        template: {
          name: "naukri_bazar_english_community",
          language: { code: "en" }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log('✅ Template works with en!');
    return { success: true, code: 'en' };
  } catch (error) {
    const code = error.response?.data?.error?.code;
    const msg = error.response?.data?.error?.message;

    console.error(`❌ Failed with code: ${code}`);
    console.error(`   Message: ${msg}`);

    if (code === 132001) {
      console.log('\n⚠️  Template not found in en translation');
      console.log('   Next steps:');
      console.log('   1. Go to WhatsApp Manager');
      console.log('   2. Check template approval status');
      console.log('   3. If pending, wait 24-48 hours');
      console.log('   4. Try other language codes: en, en_US');
    }

    return { success: false, code };
  }
}

module.exports = {
  sendMarketingTemplate,
  checkTemplateStatus
};