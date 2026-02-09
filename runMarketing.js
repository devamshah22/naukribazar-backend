require("dotenv").config();
const { sendMarketingTemplate } = require("./marketingSender");

// Usage:
// node runMarketing.js 919324509881 Friend

const phoneNumber = process.argv[2]; // phone from terminal
const userName = process.argv[3] || "Friend"; // default name

if (!phoneNumber) {
  console.error("❌ Phone number missing");
  console.error("Usage: node runMarketing.js <phoneNumber> <name>");
  console.error("Example: node runMarketing.js 919324509881 Rahul");
  process.exit(1);
}

async function run() {
  console.log("🚀 Sending marketing template...");
  console.log("📱 Phone:", phoneNumber);
  console.log("👤 Name:", userName);

  await sendMarketingTemplate(phoneNumber, userName);

  console.log("✅ Done");
}

run();
