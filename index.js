require("dotenv").config();
const express = require("express");
const cors = require("cors");

// DB connection
const connectDB = require("./config/db");

// Queue worker
const processEmailQueue = require("./workers/emailWorker");

// Routes
const applyRoute = require("./routes/apply");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB Atlas
connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("Naukri Bazar Backend Running ✅");
});

// Job application route
app.use("/apply", applyRoute);

// 🔁 Start background queue worker (every 10 seconds)
setInterval(() => {
  processEmailQueue();
}, 10000);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Naukri Bazar backend running on port ${PORT}`);
});
