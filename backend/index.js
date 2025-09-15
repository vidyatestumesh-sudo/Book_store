const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config();
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://book-app-frontend-tau.vercel.app',
      'https://bookstore-frontend-9tii.onrender.com'
    ],
    credentials: true
}));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const blogRoutes = require('./src/blogs/blog.route');

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use("/", (req, res) => {
    res.send("Book Store Server is running!");
  });
}

main()
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
