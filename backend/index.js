const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { auth } = require("express-openid-connect");
const jwt = require('jsonwebtoken');
const http = require("http");
const { Server } = require("socket.io");

const User = require('./src/users/user.model'); // User model for admin login
const Review = require("./src/review/review.model"); // Review model
const Book = require("./src/books/book.model"); // Book model

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
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

// Auth0 Middleware for regular user authentication
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};
app.use(auth(authConfig));

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// --- Socket.IO connection ---
io.on("connection", (socket) => {
  console.log("Admin connected via socket:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

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
app.use("/api/inspiration-images", inspirationRoutes);
app.use("/api/auth", authRoutes);

// Default root route
app.get("/", (req, res) => res.send("Book Store Server is running!"));

// --- Admin login logic ---
app.post("/api/admin-auth/admin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const adminUser = await User.findOne({ username, role: 'admin' });
    if (!adminUser) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: { username: adminUser.username, role: adminUser.role },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- POST a review with real-time admin notification ---
app.post("/api/reviews/:id/review", async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { userId, userName, rating, comment } = req.body;
    if (!userId || !userName || !rating || !comment) return res.status(400).send({ message: "All fields required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send({ message: "Book not found" });

    let existingReview = await Review.findOne({ bookId, userId });
    let review;
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.userName = userName;
      review = await existingReview.save();
    } else {
      const newReview = new Review({ bookId, userId, userName, rating, comment });
      review = await newReview.save();
    }

    // Emit event to admin via Socket.IO
    io.emit("newReview", review);

    res.status(200).send({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).send({ message: "Failed to submit review" });
  }
});

// --- PATCH approve/unapprove review ---
app.patch("/api/reviews/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const review = await Review.findByIdAndUpdate(id, { approved }, { new: true });
    if (!review) return res.status(404).send({ message: "Review not found" });

    res.status(200).send({ message: "Review updated", review });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update review" });
  }
});

// --- GET all reviews for admin ---
app.get("/api/reviews/admin", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).send(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
});

// --- MongoDB Connection and Server Start ---
async function main() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
    server.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

main();
