const mongoose = require('mongoose');

const ParagraphSchema = new mongoose.Schema({
  text: { type: String, required: true },
  style: { type: String, default: '' },
}, { _id: false });

const LinkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  to: { type: String, required: true },
}, { _id: false });

const ImageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
}, { _id: false });

const SectionHeadingSchema = new mongoose.Schema({
  text: { type: String, required: true },
  motifImage: { type: ImageSchema, required: true },
}, { _id: false });

const AboutAuthorLeftTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
}, { _id: false });

const AboutAuthorSchema = new mongoose.Schema({
  leftText: { type: AboutAuthorLeftTextSchema, required: true },
  rightImage: { type: ImageSchema, required: true },
}, { _id: false });

const WorkingCreedRightTextSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: { type: [ParagraphSchema], required: true },
  link: { type: LinkSchema, required: true },
}, { _id: false });

const WorkingCreedSchema = new mongoose.Schema({
  leftImage: { type: ImageSchema, required: true },
  rightText: { type: WorkingCreedRightTextSchema, required: true },
}, { _id: false });

const AuthorSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton_author' }, // Enforce singleton _id
  sectionHeading: { type: SectionHeadingSchema, required: true },
  aboutAuthor: { type: AboutAuthorSchema, required: true },
  workingCreed: { type: WorkingCreedSchema, required: true },
}, {
  timestamps: true,
  _id: false, // Disable auto _id generation (since we're using custom _id)
});

module.exports = mongoose.model('Author', AuthorSchema);
