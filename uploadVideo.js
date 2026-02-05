require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const videosDir = path.join(__dirname, "videos");
const mediaMap = {};

async function uploadVideo(language, filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("type", "video/mp4");
  form.append("messaging_product", "whatsapp");

  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/media`,
    form,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        ...form.getHeaders(),
      },
    }
  );

  return response.data.id;
}

(async () => {
  try {
    const files = fs.readdirSync(videosDir);

    for (const file of files) {
      const language = path.parse(file).name.toLowerCase();
      const filePath = path.join(videosDir, file);

      console.log(`⬆️ Uploading ${language} video...`);
      const mediaId = await uploadVideo(language, filePath);
      mediaMap[language] = mediaId;

      console.log(`✅ ${language} uploaded → media_id: ${mediaId}`);
    }

    fs.writeFileSync(
      "mediaMap.json",
      JSON.stringify(mediaMap, null, 2)
    );

    console.log("🎉 All videos uploaded successfully!");
  } catch (err) {
    console.error("❌ Upload failed:", err.response?.data || err.message);
  }
})();
