const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // URL of Cloudinary image
    suspended: { type: Boolean, default: false }, // new field
    type: { 
        type: String, 
        enum: ['blogs', 'inspiration'], 
        default: 'blogs' 
    }, // new field
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
