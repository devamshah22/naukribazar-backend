require("dotenv").config();
const { sendMarketingTemplate } = require("./marketingSender");

const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.error("❌ Please provide phone number");
  console.error("Example: node runMarketing.js 919876543210");
  process.exit(1);
}

(async () => {
  console.log("🚀 Sending marketing template to:", phoneNumber);
  await sendMarketingTemplate(phoneNumber);
  console.log("✅ Done");
})();
