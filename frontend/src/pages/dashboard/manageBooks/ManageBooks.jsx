import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
    useFetchAllBooksQuery,
    useDeleteBookMutation,
    useAddBookMutation,
} from "../../../redux/features/books/booksApi";
import axios from "axios";
import InputField from "../manageBooks/InputField";
import getBaseUrl from "../../../utils/baseURL";
import Loading from "../../../components/Loading";

const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
};
const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
const roundMoney = (n) => Math.max(0, Math.round(n));
const roundPct = (n) => clamp(Math.round(n), 0, 100);

const ManageBooks = () => {
    const [viewMode, setViewMode] = useState("list"); // toggle between list and form
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
            coverImage: "",
            backImage: "",
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

    const [lastEdited, setLastEdited] = useState(null);

    const oldPrice = toNum(watch("oldPrice"));
    const newPrice = toNum(watch("newPrice"));
    const discount = toNum(watch("discount"));

    // --- Handlers for price, discount, newPrice ---
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

    useEffect(() => {
        if (!oldPrice) {
            if (lastEdited === "discount") setValue("newPrice", "", { shouldDirty: true });
            else if (lastEdited === "newPrice") setValue("discount", "", { shouldDirty: true });
        }
    }, [oldPrice]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Fetch book data if editing ---
    useEffect(() => {
        if (editingBookId) {
            axios
                .get(`${getBaseUrl()}/api/books/${editingBookId}`)
                .then(({ data }) => {
                    Object.keys(data).forEach((key) => {
                        if (key in data) setValue(key, data[key]);
                    });
                    setViewMode("form");
                })
                .catch((err) => console.error(err));
        }
    }, [editingBookId, setValue]);

    // --- Submit handler ---
    const onSubmit = async (data) => {
        const payload = {
            ...data,
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
                    <div
                        className={`absolute top-1 left-1 w-1/2 h-10 bg-blue-600 rounded-full shadow-md transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""
                            }`}
                    ></div>

                    <button
                        className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"
                            }`}
                        onClick={() => {
                            setViewMode("list");
                            setEditingBookId(null);
                            reset();
                        }}
                    >
                        <FiEdit /> View Books
                    </button>

                    <button
                        className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"
                            }`}
                        onClick={() => {
                            setViewMode("form");
                            setEditingBookId(null);
                            reset();
                        }}
                    >
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

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <InputField label="Title" name="title" register={register} placeholder="Enter book title" />
                                    <InputField label="Author" name="author" register={register} placeholder="Enter author name" />
                                    <InputField label="About Book" name="aboutBook" register={register} placeholder="Short about book" type="textarea" />
                                    <InputField label="Description" name="description" register={register} placeholder="Enter description" type="textarea" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Cover Image URL" name="coverImage" register={register} placeholder="Enter cover image URL" />
                                        <InputField label="Back Image URL" name="backImage" register={register} placeholder="Enter back image URL" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Language" name="language" register={register} placeholder="Enter language" />
                                        <InputField label="Binding" name="binding" register={register} placeholder="Enter binding" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Publisher" name="publisher" register={register} placeholder="Enter publisher" />
                                        <InputField label="ISBN" name="isbn" register={register} placeholder="Enter ISBN" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Publishing Date" name="publishingDate" register={register} type="date" />
                                        <InputField label="Pages" name="pages" register={register} type="number" placeholder="Enter pages" />
                                    </div>

                                    {/* ✅ Pricing block */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Old Price</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("oldPrice", { onChange: handleOldPriceChange })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Price</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("newPrice", { onChange: handleNewPriceChange })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                max="100"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("discount", { onChange: handleDiscountChange })}
                                            />
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
                                        className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
                                    >
                                        {editingBookId ? "Update Book" : adding ? "Adding..." : "Add Book"}
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
                                                            className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md transition"
                                                        >
                                                            <FiEdit /> Edit
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