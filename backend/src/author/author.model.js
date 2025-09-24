const mongoose = require('mongoose');

// Paragraph inside aboutAuthor and workingCreed
const ParagraphSchema = new mongoose.Schema({
  text: { type: String, required: true },
  style: { type: String, default: '' },
}, { _id: false });

// For buttons or links (like "Read More")
const LinkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  to: { type: String, required: true },
}, { _id: false });

// For images (all images use this format)
const ImageSchema = new mongoose.Schema({
  src: { type: String, required: true }, // URL or path to image
  alt: { type: String, required: true }, // Alt text for accessibility
}, { _id: false });

// Section Heading with motif image
const SectionHeadingSchema = new mongoose.Schema({
  text: { type: String, required: true },
  motifImage: { type: ImageSchema, required: true },
}, { _id: false });

// About Author > Left Text
const AboutAuthorLeftTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
}, { _id: false });

// About Author section
const AboutAuthorSchema = new mongoose.Schema({
  leftText: { type: AboutAuthorLeftTextSchema, required: true },
  rightImage: { type: ImageSchema, required: true },
}, { _id: false });

// Working Creed > Right Text
const WorkingCreedRightTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
  link: { type: LinkSchema, required: true },
}, { _id: false });

// Working Creed section
const WorkingCreedSchema = new mongoose.Schema({
  leftImage: { type: ImageSchema, required: true },
  rightText: { type: WorkingCreedRightTextSchema, required: true },
}, { _id: false });

// Main Author schema
const AuthorSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton_author' }, // Ensure only one document exists
  sectionHeading: { type: SectionHeadingSchema, required: true },
  aboutAuthor: { type: AboutAuthorSchema, required: true },
  workingCreed: { type: WorkingCreedSchema, required: true },
}, {
  timestamps: true,
  _id: false, // disable ObjectId and use our custom string ID
});

module.exports = mongoose.model('Author', AuthorSchema);
