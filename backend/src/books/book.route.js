const express = require("express");
const router = express.Router();

const {
  postABook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteABook,
} = require("./book.controller");

router.post("/create-book", postABook);           
router.get("/", getAllBooks);           
router.get("/:id", getSingleBook);      
router.put("/edit/:id", updateBook);    
router.delete("/:id", deleteABook);     

module.exports = router;
