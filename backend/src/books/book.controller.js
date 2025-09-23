const Book = require("./book.model");
const { uploadToCloudinary } = require("../config/cloudinary"); // ✅ Add this line here
const postABook = async (req, res) => {
  try {
    const {
      title,
      author,
      aboutBook,
      description,
      oldPrice,
      newPrice,
      discount,
      language,
      binding,
      publisher,
      isbn,
      publishingDate,
      pages,
    } = req.body;

    const bookData = {
      title,
      author,
      aboutBook,
      description,
      oldPrice: parseFloat(oldPrice || 0),
      newPrice: parseFloat(newPrice || 0),
      discount: parseFloat(discount || 0),
      language,
      binding,
      publisher,
      isbn,
      publishingDate,
      pages: parseInt(pages || 0),
    };

    // Handle image uploads
    if (req.files?.coverImage?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.coverImage[0].buffer, "books");
      bookData.coverImage = uploaded.secure_url;
    }

    if (req.files?.backImage?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.backImage[0].buffer, "books");
      bookData.backImage = uploaded.secure_url;
    }

    const newBook = new Book(bookData);
    await newBook.save();

    res.status(201).send({ message: "Book posted successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).send({ message: "Failed to create book" });
  }
};

// ✅ Get all books (admin view)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

// ✅ Get only non-suspended books (user view)
const getAllBooksForUsers = async (req, res) => {
  try {
    const books = await Book.find({ suspended: false }).sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books for users", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

// ✅ Get single book by ID
const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send({ message: "Book not Found!" });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({ message: "Failed to fetch book" });
  }
};

// ✅ Update book (with image replacement support)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) return res.status(404).send({ message: "Book not found" });

    const {
      title,
      author,
      aboutBook,
      description,
      oldPrice,
      newPrice,
      discount,
      language,
      binding,
      publisher,
      isbn,
      publishingDate,
      pages,
    } = req.body;

    // Update fields if they exist
    if (title) book.title = title;
    if (author) book.author = author;
    if (aboutBook) book.aboutBook = aboutBook;
    if (description) book.description = description;
    if (oldPrice) book.oldPrice = parseFloat(oldPrice);
    if (newPrice) book.newPrice = parseFloat(newPrice);
    if (discount) book.discount = parseFloat(discount);
    if (language) book.language = language;
    if (binding) book.binding = binding;
    if (publisher) book.publisher = publisher;
    if (isbn) book.isbn = isbn;
    if (publishingDate) book.publishingDate = publishingDate;
    if (pages) book.pages = parseInt(pages);

    // Handle image re-uploads
    if (req.files?.coverImage?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.coverImage[0].buffer, "books");
      book.coverImage = uploaded.secure_url;
    }

    if (req.files?.backImage?.[0]) {
      const uploaded = await uploadToCloudinary(req.files.backImage[0].buffer, "books");
      book.backImage = uploaded.secure_url;
    }

    await book.save();
    res.status(200).send({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error updating a book", error);
    res.status(500).send({ message: "Failed to update a book" });
  }
};

// ✅ Delete a book
const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book not Found!" });
    }
    res.status(200).send({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    console.error("Error deleting a book", error);
    res.status(500).send({ message: "Failed to delete a book" });
  }
};

// ✅ Suspend a book
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

// ✅ Unsuspend a book
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
  getSingleBook,
  updateBook,
  deleteABook,
  suspendBook,
  unsuspendBook,
};
