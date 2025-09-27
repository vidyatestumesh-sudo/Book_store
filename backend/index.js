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
const contactRoutes = require("./src/contact/contact.route");
const authRoutes = require("./src/users/auth.routes");
const bannerRoutes = require("./src/home/banner/banner.routes");
const readerThoughtRoutes = require("./src/home/ReaderThoughts/ReaderThoughts.routes");
const authorRoutes = require("./src/author/author.route");
const cornerRoutes = require("./src/home/corners/corner.routes");
const preceptsRoutes = require("./src/precepts/precepts.routes");
const reviewRoutes = require("./src/review/review.routes");
const inspirationRoutes = require("./src/inspiration/inspirationImages.routes");

// Mount routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/letters", letterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reader-thoughts", readerThoughtRoutes);
app.use("/api/home/banner", bannerRoutes);
app.use("/api/home/corners", cornerRoutes);
app.use("/api/author", authorRoutes);
app.use("/api/precepts", preceptsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inspiration-images", inspirationRoutes); // <-- Correct mounting here

app.use("/api/admin-auth", authRoutes);   // for admin login


// Default root route
app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});

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
