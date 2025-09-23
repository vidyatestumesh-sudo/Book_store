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

// Corrected path to upload middleware
const upload = require("../middlewares/upload.middleware");

router.post(
  "/create-book",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  postABook
);

router.put(
  "/edit/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  updateBook
);

router.get("/", getAllBooks);                  // All books (admin)
router.get("/user", getAllBooksForUsers);      // Only non-suspended (user)
router.get("/:id", getSingleBook);             // Single book by ID
router.delete("/:id", deleteABook);            // Delete book
router.put("/suspend/:id", suspendBook);       // Suspend
router.put("/unsuspend/:id", unsuspendBook);   // Unsuspend

module.exports = router;
