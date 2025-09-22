const express = require("express");
const router = express.Router();

const {
  postContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
} = require("./contact.controller");

// Routes
router.post("/create-contact", postContact); // create new contact
router.get("/", getAllContacts); // get all contacts
router.get("/:id", getSingleContact); // get single contact by ID
router.delete("/:id", deleteContact); // delete contact by ID

module.exports = router;
