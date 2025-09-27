const Book = require("./book.model");
const Review = require("../review/review.model"); // ✅ Needed for attaching reviews to a book

const postABook = async (req, res) => {
  try {
    const newBook = new Book({ ...req.body });
    await newBook.save();
    res.status(200).send({ message: "Book posted successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).send({ message: "Failed to create book" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

const getAllBooksForUsers = async (req, res) => {
  try {
    const books = await Book.find({ suspended: false }).sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching user books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).lean(); // .lean() returns a plain JS object

    if (!book) {
      return res.status(404).send({ message: "Book not found!" });
    }

    const reviews = await Review.find({ bookId: id }).sort({ createdAt: -1 }).lean();
    book.reviews = reviews;

    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({ message: "Failed to fetch book" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.hasOwnProperty("stock")) {
      if (typeof updateData.stock !== "number" || updateData.stock < 0) {
        return res.status(400).send({ message: "Stock must be a non-negative number" });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBook) {
      return res.status(404).send({ message: "Book not found!" });
    }

    res.status(200).send({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book", error);
    res.status(500).send({ message: "Failed to update book" });
  }
};

const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found!" });
    }
    res.status(200).send({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).send({ message: "Failed to delete book" });
  }
};

const suspendBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(
      id,
      { suspended: true },
      { new: true }
    );
    if (!book) return res.status(404).send({ message: "Book not found" });
    res.status(200).send({ message: "Book suspended successfully", book });
  } catch (error) {
    console.error("Error suspending book", error);
    res.status(500).send({ message: "Failed to suspend book" });
  }
};

const unsuspendBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(
      id,
      { suspended: false },
      { new: true }
    );
    if (!book) return res.status(404).send({ message: "Book not found" });
    res.status(200).send({ message: "Book unsuspended successfully", book });
  } catch (error) {
    console.error("Error unsuspending book", error);
    res.status(500).send({ message: "Failed to unsuspend book" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getAllBooksForUsers,
  getSingleBook,     // ✅ includes reviews
  updateBook,
  deleteABook,
  suspendBook,
  unsuspendBook,
};
