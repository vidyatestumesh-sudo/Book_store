// backend/author/author.model.js
const mongoose = require('mongoose');

const ParagraphSchema = new mongoose.Schema({
  text: { type: String, required: true },
  style: { type: String },
});

const LinkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  to: { type: String, required: true },
});

const ImageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
});

const SectionHeadingSchema = new mongoose.Schema({
  text: { type: String, required: true },
  motifImage: ImageSchema,
});

const AboutAuthorLeftTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: [ParagraphSchema],
});

const AboutAuthorSchema = new mongoose.Schema({
  leftText: AboutAuthorLeftTextSchema,
  rightImage: ImageSchema,
});

const WorkingCreedRightTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: [ParagraphSchema],
  link: LinkSchema,
});

const WorkingCreedSchema = new mongoose.Schema({
  leftImage: ImageSchema,
  rightText: WorkingCreedRightTextSchema,
});

const AuthorSchema = new mongoose.Schema({
  sectionHeading: SectionHeadingSchema,
  aboutAuthor: AboutAuthorSchema,
  workingCreed: WorkingCreedSchema,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Author', AuthorSchema);
