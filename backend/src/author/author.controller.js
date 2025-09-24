const Author = require('./author.model');

// Save or update the singleton author document
async function upsertAuthorContent(content) {
  try {
    const singletonId = 'singleton_author';

    const updatedDoc = await Author.findOneAndUpdate(
      { _id: singletonId },  // Query by fixed _id
      { ...content, _id: singletonId }, // Ensure _id is set on update
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return updatedDoc;
  } catch (error) {
    console.error('Error saving author content:', error);
    throw error;
  }
}

// Retrieve the singleton author document
async function getAuthorContent() {
  const singletonId = 'singleton_author';
  return await Author.findById(singletonId);
}

module.exports = {
  upsertAuthorContent,
  getAuthorContent,
};
