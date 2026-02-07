require("dotenv").config();
const express = require("express");
const axios = require("axios");
const mediaMap = require("./mediaMap.json");

const app = express();
app.use(express.json());

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

/* ------------------ Webhook verification ------------------ */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/* ------------------ Language detection ------------------ */
function detectLanguage(text) {
  if (/[\u0B80-\u0BFF]/.test(text)) return "tamil";
  if (/[\u0C00-\u0C7F]/.test(text)) return "telugu";
  if (/[\u0D00-\u0D7F]/.test(text)) return "malayalam";
  if (/[\u0980-\u09FF]/.test(text)) return "bengali";
  if (/[\u0A80-\u0AFF]/.test(text)) return "gujarati";

  // Devanagari (Hindi / Marathi)
  if (/[\u0900-\u097F]/.test(text)) {
    if (
      text.includes("मला") ||
      text.includes("हवी") ||
      text.includes("आहे") ||
      text.includes("पासून")
    ) {
      return "marathi";
    }
    return "hindi";
  }

  return "english";
}

/* ------------------ Community text messages ------------------ */
const communityMessageMap = {
  hindi: `Namaste 🙏  
Naukri updates ke liye niche diye gaye WhatsApp group ko join kijiye 👇  
https://chat.whatsapp.com/KyPC99aYP9jLUXQDVkotbk`,

  english: `Hello 👋  
Join the WhatsApp group below to receive job updates 👇  
https://chat.whatsapp.com/ENGLISH_GROUP_LINK`,

  gujarati: `Namaskar 🙏  
Naukri updates mate niche aapel WhatsApp group join karo 👇  
https://chat.whatsapp.com/GUJARATI_GROUP_LINK`,

  tamil: `வணக்கம் 🙏  
வேலை வாய்ப்புகளைப் பெற கீழே உள்ள WhatsApp குழுவில் சேருங்கள் 👇  
https://chat.whatsapp.com/TAMIL_GROUP_LINK`,

  telugu: `నమస్తే 🙏  
ఉద్యోగ సమాచారం కోసం క్రింది WhatsApp గ్రూప్‌లో చేరండి 👇  
https://chat.whatsapp.com/TELUGU_GROUP_LINK`,

  bengali: `নমস্কার 🙏  
চাকরির আপডেট পেতে নিচের WhatsApp গ্রুপে যোগ দিন 👇  
https://chat.whatsapp.com/BENGALI_GROUP_LINK`,

  marathi: `नमस्कार 🙏  
नोकरी अपडेटसाठी खालील WhatsApp गटात सामील व्हा 👇  
https://chat.whatsapp.com/MARATHI_GROUP_LINK`,

  malayalam: `നമസ്കാരം 🙏  
ജോലി അപ്ഡേറ്റുകൾക്കായി താഴെ നൽകിയ WhatsApp ഗ്രൂപ്പിൽ ചേരുക 👇  
https://chat.whatsapp.com/MALAYALAM_GROUP_LINK`
};

/* ------------------ Send text ------------------ */
async function sendText(to, body) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

/* ------------------ Send video ------------------ */
async function sendVideo(to, mediaId) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "video",
      video: { id: mediaId }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

/* ------------------ Receive messages ------------------ */
app.post("/webhook", async (req, res) => {
  try {
    const msg =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg || msg.type !== "text") return res.sendStatus(200);

    const text = msg.text.body;
    const from = msg.from;

    const language = detectLanguage(text);

    const replyText =
      communityMessageMap[language] || communityMessageMap["english"];

    const mediaId =
      mediaMap[language] || mediaMap["english"];

    // 1️⃣ Send text + community link
    await sendText(from, replyText);
    console.log(`💬 Sent ${language} community message`);

    // 2️⃣ Send language-specific video
    if (mediaId) {
      await sendVideo(from, mediaId);
      console.log(`🎥 Sent ${language} video`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.sendStatus(200);
  }
});

/* ------------------ Start server ------------------ */
const PORT = process.env.WEBHOOK_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook running on port ${PORT}`);
});
