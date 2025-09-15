const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
