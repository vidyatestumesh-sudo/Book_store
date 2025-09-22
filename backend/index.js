const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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
    ],
    credentials: true,
  })
);

// Route imports
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const blogRoutes = require("./src/blogs/blog.route");
const letterRoutes = require("./src/letters/letter.route");
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
