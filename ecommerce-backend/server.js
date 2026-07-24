const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json());

// ============================
// Static Images
// ============================
app.use("/images", express.static(path.join(__dirname, "images")));

// ============================
// Home Route
// ============================
app.get("/", (req, res) => {
  res.send("E-Commerce Backend is Running");
});

// ============================
// MongoDB Connection
// ============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("==================================");
    console.log("✅ MongoDB Connected");
    console.log("Database Name:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("==================================");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// ============================
// Routes
// ============================
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});