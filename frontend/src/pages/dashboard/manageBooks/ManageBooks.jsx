import React, { useEffect, useState, useRef } from "react"; // Import useRef
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  useFetchAllBooksQuery,
  useDeleteBookMutation,
  useAddBookMutation,
} from "../../../redux/features/books/booksApi";
import axios from "axios";
import InputField from "../manageBooks/InputField";
import getBaseUrl from "../../../utils/baseURL";
import { FiEdit, FiTrash2, FiUploadCloud } from "react-icons/fi"; // Add FiUploadCloud

const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
const roundMoney = (n) => Math.max(0, Math.round(n));
const roundPct = (n) => clamp(Math.round(n), 0, 100);
const ManageBooks = () => {
  const [viewMode, setViewMode] = useState("list");
  const { data: books, refetch } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const [addBook, { isLoading: adding }] = useAddBookMutation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingBookId, setEditingBookId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      aboutBook: "",
      description: "",
      coverImage: null, // Change to null for file input
      backImage: null,  // Change to null for file input
      oldPrice: "",
      newPrice: "",
      discount: "",
      language: "",
      binding: "",
      publisher: "",
      isbn: "",
      publishingDate: "",
      pages: "",
    },
  });
  const [coverImageName, setCoverImageName] = useState("");
  const [backImageName, setBackImageName] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const coverImageRef = useRef(null); // Ref for cover image input
  const backImageRef = useRef(null);  // Ref for back image input
  const [lastEdited, setLastEdited] = useState(null);
  const oldPrice = toNum(watch("oldPrice"));
  const newPrice = toNum(watch("newPrice"));
  const discount = toNum(watch("discount"));
  const handleOldPriceChange = (e) => {
    setLastEdited("oldPrice");
    const oldP = toNum(e.target.value);
    const disc = toNum(getValues("discount"));
    const np = toNum(getValues("newPrice"));
    if (disc > 0) {
      const calcNew = roundMoney(oldP * (1 - disc / 100));
      setValue("newPrice", calcNew, { shouldDirty: true });
    } else if (np > 0) {
      const calcDisc = roundPct(((oldP - np) / (oldP || 1)) * 100);
      setValue("discount", calcDisc, { shouldDirty: true });
    }
  };
  const handleDiscountChange = (e) => {
    setLastEdited("discount");
    const disc = clamp(toNum(e.target.value), 0, 100);
    const oldP = toNum(getValues("oldPrice"));
    if (oldP > 0) {
      const calcNew = roundMoney(oldP * (1 - disc / 100));
      setValue("discount", disc, { shouldDirty: true });
      setValue("newPrice", calcNew, { shouldDirty: true });
    }
  };
  const handleNewPriceChange = (e) => {
    setLastEdited("newPrice");
    const np = toNum(e.target.value);
    const oldP = toNum(getValues("oldPrice"));
    if (oldP > 0) {
      const calcDisc = roundPct(((oldP - np) / oldP) * 100);
      setValue("newPrice", np, { shouldDirty: true });
      setValue("discount", calcDisc, { shouldDirty: true });
    }
  };
  const handleSuspendBook = async (book) => {
    const action = book.suspended ? "unsuspend" : "suspend";
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this book?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.put(
        `${getBaseUrl()}/api/books/${action}/${book._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      Swal.fire("Success", `Book ${action}ed successfully`, "success");
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update book status", "error");
    }
  };
  useEffect(() => {
    if (!oldPrice) {
      if (lastEdited === "discount") setValue("newPrice", "", { shouldDirty: true });
      else if (lastEdited === "newPrice") setValue("discount", "", { shouldDirty: true });
    }
  }, [oldPrice, lastEdited, setValue]); // Added dependencies
  useEffect(() => {
    if (editingBookId) {
      axios
        .get(`${getBaseUrl()}/api/books/${editingBookId}`)
        .then(({ data }) => {
          Object.keys(data).forEach((key) => {
            if (key in data && key !== "coverImage" && key !== "backImage") { // Exclude image fields from direct setValue
              setValue(key, data[key]);
            }
          });
          const extractFileName = (url) => {
            if (!url) return "";
            try {
              const parts = url.split("/");
              // Get the last part and remove query parameters if any
              return parts.length > 0 ? parts[parts.length - 1].split("?")[0] : "";
            } catch {
              return "";
            }
          };
          setCoverImageName(extractFileName(data.coverImage));
          setBackImageName(extractFileName(data.backImage));
          setCoverPreview(data.coverImage || "");
          setBackPreview(data.backImage || "");
          setViewMode("form");
        })
        .catch((err) => console.error(err));
    } else {
      setCoverImageName("");
      setBackImageName("");
      setCoverPreview("");
      setBackPreview("");
      reset(); // Also reset form fields when not editing
    }
  }, [editingBookId, setValue, reset]); 
  const onSubmit = async (data) => {
    const coverFile = data.coverImage[0];
    const backFile = data.backImage[0];
 const uploadImage = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("image", file); // 'image' is the field name expected by your /api/upload endpoint
        try {
            const res = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return res.data.imageUrl; // The imageUrl returned from your new /api/upload endpoint
        } catch (error) {
            console.error("Image upload failed:", error);
            Swal.fire("Error", "Failed to upload image.", "error");
            return null;
        }
    };
    let uploadedCoverImageUrl = coverPreview; // Default to existing preview URL
    let uploadedBackImageUrl = backPreview;   // Default to existing preview URL
    if (coverFile) { // If a new cover file is selected
        uploadedCoverImageUrl = await uploadImage(coverFile);
        if (!uploadedCoverImageUrl) return; // Stop if upload failed
    }
    if (backFile) { // If a new back file is selected
        uploadedBackImageUrl = await uploadImage(backFile);
        if (!uploadedBackImageUrl) return; // Stop if upload failed
    }
    const payload = {
      ...data,
      coverImage: uploadedCoverImageUrl, // Use the uploaded URL or existing
      backImage: uploadedBackImageUrl,   // Use the uploaded URL or existing
      oldPrice: toNum(data.oldPrice),
      newPrice: toNum(data.newPrice),
      discount: toNum(data.discount),
      pages: toNum(data.pages),
    };
    try {
      if (editingBookId) {
        await axios.put(`${getBaseUrl()}/api/books/edit/${editingBookId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        Swal.fire("Book Updated", "Book updated successfully!", "success");
      } else {
        await addBook(payload).unwrap();
        Swal.fire("Book Added", "Book added successfully!", "success");
      }
      reset();
      setEditingBookId(null);
      setViewMode("list");
      refetch();
      setCoverPreview("");
      setBackPreview("");
      setCoverImageName("");
      setBackImageName("");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to save book. Please try again.", "error");
    }
  };
  const handleDeleteBook = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteBook(id).unwrap();
      Swal.fire("Deleted!", "Book deleted successfully.", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete book. Please try again.", "error");
    }
  };
  const handleEditBook = (bookId) => {
    setEditingBookId(bookId);
  };
    return (
        <div className="container mt-[100px]">
            <div className="max-w-8xl mx-auto rounded-lg">
                {/* Toggle Buttons */}
                <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
                    <div className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : "" }`}></div>
                    <button
                        className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list"
                            ? "text-white"
                            : "text-gray-700 hover:text-gray-900 hover:scale-105"
                            }`}
                        onClick={() => {
                            setViewMode("list");
                            setEditingBookId(null);
                            reset();
                        }}>
                        <MenuBookIcon /> View Books
                    </button>
                    <button
                        className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"
                            }`}
                        onClick={() => {
                            setViewMode("form");
                            setEditingBookId(null);
                            reset();
                        }}>
                        <FiEdit /> Add Book
                    </button>
                </div>
                {/* Form */}
                {viewMode === "form" && (
                    <div className="container">
                        <div className="mt-[50px]">
                            <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                    {editingBookId ? "Edit Book" : "Add New Book"}
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
                                    <InputField label="Title" name="title" register={register} placeholder="Enter book title" />
                                    <InputField label="Author" name="author" register={register} placeholder="Enter author name" />
                                    <InputField label="About Book" name="aboutBook" register={register} placeholder="Short about book" type="textarea" />
                                    <InputField label="Description" name="description" register={register} placeholder="Enter description" type="textarea" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Cover Image Uploader */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Cover Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                {...register("coverImage")}
                                                className="hidden" // Hide the default input
                                                ref={coverImageRef} // Attach ref
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setCoverImageName(file?.name || "");
                                                    if (file) {
                                                        const previewUrl = URL.createObjectURL(file);
                                                        setCoverPreview(previewUrl);
                                                    } else {
                                                        setCoverPreview("");
                                                        setValue("coverImage", null); // Clear value if no file
                                                    }
                                                }}
                                            />
                                            {/* Custom button to trigger file input */}
                                            <button
                                                type="button"
                                                onClick={() => coverImageRef.current.click()}
                                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 flex items-center justify-center gap-2 transition-colors duration-200"
                                            >
                                                <FiUploadCloud className="text-lg" />
                                                {coverImageName ? coverImageName : "Upload Cover Image"}
                                            </button>
                                            {coverPreview && (
                                                <img
                                                    src={coverPreview}
                                                    alt="Cover Preview"
                                                    className="mt-2 max-h-48 w-auto object-contain rounded-md border shadow-sm"
                                                />
                                            )}
                                        </div>
                                        {/* Back Image Uploader */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Back Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                {...register("backImage")}
                                                className="hidden" // Hide the default input
                                                ref={backImageRef} // Attach ref
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setBackImageName(file?.name || "");
                                                    if (file) {
                                                        const previewUrl = URL.createObjectURL(file);
                                                        setBackPreview(previewUrl);
                                                    } else {
                                                        setBackPreview("");
                                                        setValue("backImage", null); // Clear value if no file
                                                    }
                                                }}/>
                                            {/* Custom button to trigger file input */}
                                            <button
                                                type="button"
                                                onClick={() => backImageRef.current.click()}
                                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 flex items-center justify-center gap-2 transition-colors duration-200"
                                            >
                                                <FiUploadCloud className="text-lg" />
                                                {backImageName ? backImageName : "Upload Back Image"}
                                            </button>
                                            {backPreview && (
                                                <img
                                                    src={backPreview}
                                                    alt="Back Preview"
                                                    className="mt-2 max-h-48 w-auto object-contain rounded-md border shadow-sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="Language"
                                            name="language"
                                            register={register}
                                            placeholder="Enter language"/>
                                        <InputField
                                            label="Binding"
                                            name="binding"
                                            register={register}
                                            placeholder="Enter binding"/>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="Publisher"
                                            name="publisher"
                                            register={register}
                                            placeholder="Enter publisher"/>
                                        <InputField
                                            label="ISBN"
                                            name="isbn"
                                            register={register}
                                            placeholder="Enter ISBN"/>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="Publishing Date"
                                            name="publishingDate"
                                            register={register}
                                            type="date"/>
                                        <InputField
                                            label="Pages"
                                            name="pages"
                                            register={register}
                                            type="number"
                                            placeholder="Enter pages"/>
                                    </div>
                                    {/* Pricing block */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Old Price
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("oldPrice", { onChange: handleOldPriceChange })}/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                New Price
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("newPrice", { onChange: handleNewPriceChange })}/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                max="100"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("discount", { onChange: handleDiscountChange })}/>
                                        </div>
                                    </div>
                                    {oldPrice > 0 && (newPrice > 0 || discount > 0) && (
                                        <p className="mt-3 text-sm text-gray-700">
                                            Final Price:{" "}
                                            <span className="font-semibold text-green-600">₹{newPrice || 0}</span>
                                            {discount > 0 && (
                                                <span className="ml-2 text-red-500 font-semibold">
                                                    ({roundPct(discount)}% OFF)
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={adding} // disable while adding/updating
                                        className={`py-2 mt-4 bg-blue-700 hover:bg-blue-800 transition text-white font-bold px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 ${adding ? "opacity-50 cursor-not-allowed" : ""
                                            }`}>
                                        {adding ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                                {editingBookId ? "Updating..." : "Adding..."}
                                            </>
                                        ) : editingBookId ? (
                                            "Update Book"
                                        ) : (
                                            "Add Book"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {/* ✅ Book List */}
                {viewMode === "list" && (
                    <div className="container mt-[50px]">
                        <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                Book List
                            </h2>
                            {/* ✅ Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                                            <th className="px-6 py-3 text-left">#</th>
                                            <th className="px-6 py-3 text-left">Book Title</th>
                                            <th className="px-6 py-3 text-left">Price</th>
                                            <th className="px-6 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books && books.length > 0 ? (
                                            books.map((book, index) => (
                                                <tr key={book._id} className="border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm">{book.title}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        {book.oldPrice && book.discount > 0 ? (
                                                            <div>
                                                                <span className="text-gray-400 line-through mr-2">₹{book.oldPrice}</span>
                                                                <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                                <span className="ml-2 text-red-500 font-semibold">({book.discount}% OFF)</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                                                        <button
                                                            onClick={() => handleEditBook(book._id)}
                                                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
                                                        >
                                                            <FiEdit /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleSuspendBook(book)}
                                                            className={`flex items-center gap-1 ${book.suspended ? "bg-indigo-500 hover:bg-indigo-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white px-3 py-1 rounded-md transition`}
                                                        >
                                                            {book.suspended ? "Unsuspend" : "Suspend"}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteBook(book._id)}
                                                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                                                        >
                                                            <FiTrash2 /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-6 text-gray-500">
                                                    No books available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* ✅ Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {books && books.length > 0 ? (
                                    books.map((book, index) => (
                                        <div
                                            key={book._id}
                                            className="bg-gray-50 p-4 rounded-lg shadow flex flex-col space-y-2"
                                        >
                                            {/* Title */}
                                            <div className="font-semibold text-sm">
                                                {index + 1}. {book.title}
                                            </div>
                                            {/* Price */}
                                            <div className="text-sm text-gray-600">
                                                {book.oldPrice && book.discount > 0 ? (
                                                    <>
                                                        <span className="line-through text-gray-400 mr-1">₹{book.oldPrice}</span>
                                                        <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                        <span className="ml-1 text-red-500 font-semibold">({book.discount}% OFF)</span>
                                                    </>
                                                ) : (
                                                    <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                )}
                                            </div>
                                            {/* Actions */}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditBook(book._id)}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-md transition"
                                                >
                                                    <FiEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition"
                                                >
                                                    <FiTrash2 /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">No books available</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
export default ManageBooks;