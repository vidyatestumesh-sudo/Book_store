const Contact = require("./contact.model");

// Create a new contact message
const postContact = async (req, res) => {
  try {
    const newContact = new Contact({ ...req.body });
    await newContact.save();
    res
      .status(200)
      .send({
        message: "Contact message submitted successfully",
        contact: newContact,
      });
  } catch (error) {
    console.error("Error creating contact", error);
    res.status(500).send({ message: "Failed to submit contact message" });
  }
};

// Get all contact messages
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).send(contacts);
  } catch (error) {
    console.error("Error fetching contacts", error);
    res.status(500).send({ message: "Failed to fetch contacts" });
  }
};

// Get single contact message by ID
const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).send({ message: "Contact message not found" });
    }
    res.status(200).send(contact);
  } catch (error) {
    console.error("Error fetching contact", error);
    res.status(500).send({ message: "Failed to fetch contact" });
  }
};

// Delete a contact message
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).send({ message: "Contact message not found" });
    }
    res.status(200).send({
      message: "Contact message deleted successfully",
      contact: deletedContact,
    });
  } catch (error) {
    console.error("Error deleting contact", error);
    res.status(500).send({ message: "Failed to delete contact" });
  }
};

module.exports = {
  postContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
};
