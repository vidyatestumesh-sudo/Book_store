const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-app-frontend-tau.vercel.app",
      "https://bookstore-frontend-9tii.onrender.com",
      "*", // Allow all origins, consider removing "*" for production
    ],
    credentials: true,
  })
);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created ✅");
}

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Route imports
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const blogRoutes = require("./src/blogs/blog.route");
const letterRoutes = require("./src/letters/letter.route"); // check filename consistency here
const contactRoutes = require("./src/contact/contact.route");
const authRoutes = require("./auth.routes");
const bannerRoutes = require("./src/home/banner/banner.routes");
const readerThoughtRoutes = require("./src/home/ReaderThoughts/ReaderThoughts.routes");

// Use routes
app.use("/api/reader-thoughts", readerThoughtRoutes);
app.use("/api/home/banner", bannerRoutes);
app.use("/", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/letters", letterRoutes);
app.use("/api/contact", contactRoutes);

// Connect to MongoDB and start server
async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

main();

// Default root route
app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});
