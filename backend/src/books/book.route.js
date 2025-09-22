const express = require("express");
const router = express.Router();

const {
  postABook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteABook,
  suspendBook,
  unsuspendBook,
  getAllBooksForUsers,
} = require("./book.controller");

router.post("/create-book", postABook);           
router.get("/", getAllBooks);           
router.get("/:id", getSingleBook);      
router.put("/edit/:id", updateBook);    
router.delete("/:id", deleteABook);     
router.put("/suspend/:id", suspendBook);    // Suspend a book
router.put("/unsuspend/:id", unsuspendBook); // Revert suspension
router.get("/user", getAllBooksForUsers);   // Only non-suspended books for normal users

module.exports = router;
