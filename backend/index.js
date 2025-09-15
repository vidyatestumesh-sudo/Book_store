const express = require("express");
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config();
const path = require('path');
const fs = require('fs'); // ✅ for file system operations
<<<<<<< Updated upstream


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

=======
>>>>>>> Stashed changes

app.use(express.json());
app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://book-app-frontend-tau.vercel.app',
      'https://bookstore-frontend-9tii.onrender.com'
    ],
    credentials: true
}));

<<<<<<< Updated upstream

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Uploads folder created ✅");
}

// ✅ Serve uploaded images
app.use('/uploads', express.static(uploadsDir));
>>>>>>> Stashed changes

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Uploads folder created ✅");
}

// ✅ Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Routes
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const blogRoutes = require('./src/blogs/blog.route');
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const letterRoutes = require('./src/letters/letter.route');
const blogRoutes = require("./src/blogs/blogRoutes");
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/letters", letterRoutes);
app.use("/api/blogs", blogRoutes);

app.use("/", (req, res) => {
  res.send("Book Store Server is running!");
});

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

main()
  .then(() => console.log("Mongodb connected successfully!"))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
