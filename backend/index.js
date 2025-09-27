const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { auth } = require("express-openid-connect");
const jwt = require('jsonwebtoken');
const User = require('./src/users/user.model'); // User model for admin login

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Your frontend URL (local dev)
      "https://book-app-frontend-tau.vercel.app", // Vercel frontend URL
      "https://bookstore-frontend-9tii.onrender.com", // Render frontend URL
    ],
    credentials: true, // Allow cookies and credentials
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

// Admin Auth routes (Custom Admin login via username/password)
app.use("/api/auth", authRoutes); // Admin login via Auth0

// Default root route
app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});

// Admin login logic (username/password)
app.post("/api/admin-auth/admin", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the admin user in the database
    const adminUser = await User.findOne({ username, role: 'admin' });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the password (using bcrypt)
    const isMatch = await adminUser.comparePassword(password);  // comparePassword method on the User model
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }  // Token expires in 1 hour
    );

    // Send the token and user details back to the frontend
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

// MongoDB Connection and Server Start
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