import React, { useEffect } from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';

const ManageBooks = () => {
    const navigate = useNavigate();

    const { data: books, refetch } = useFetchAllBooksQuery();
    const [deleteBook] = useDeleteBookMutation();

    const handleDeleteBook = async (id) => {
        try {
            await deleteBook(id).unwrap();
            alert('Book deleted successfully!');
            refetch();
        } catch (error) {
            console.error('Failed to delete book:', error.message);
            alert('Failed to delete book. Please try again.');
        }
    };

    // 🔹 Refresh books list (and prices) whenever component mounts
    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <section className="py-1 bg-blueGray-50">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                <h3 className="font-semibold text-base text-blueGray-700">All Books</h3>
                            </div>
                        </div>
                    </div>

                    <div className="block w-full overflow-x-auto">
                        <table className="items-center bg-transparent w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">#</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">Book Title</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">Price</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books && books.map((book, index) => (
                                    <tr key={book._id}>
                                        <td className="border-t-0 px-6 text-xs whitespace-nowrap p-4">{index + 1}</td>
                                        <td className="border-t-0 px-6 text-xs whitespace-nowrap p-4">{book.title}</td>
                                        <td className="border-t-0 px-6 text-xs whitespace-nowrap p-4">
                                            {book.oldPrice && book.discount > 0 ? (
                                                <div>
                                                    <span className="text-gray-500 line-through mr-2">₹{book.oldPrice}</span>
                                                    <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                    <span className="ml-2 text-red-500 font-bold">({book.discount}% OFF)</span>
                                                </div>
                                            ) : (
                                                <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                            )}
                                        </td>
                                        <td className="border-t-0 px-6 text-xs whitespace-nowrap p-4 space-x-4">
                                            <Link to={`/dashboard/edit-book/${book._id}`} className="font-medium text-indigo-600 hover:underline">
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteBook(book._id)} 
                                                className="font-medium bg-red-500 py-1 px-4 rounded-full text-white">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ManageBooks
